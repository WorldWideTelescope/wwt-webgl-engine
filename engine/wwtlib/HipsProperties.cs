using System.Collections.Generic;

namespace wwtlib
{

    public class HipsProperties
    {
        public Dictionary<string, string> Properties { get { return properties; } }
        public SpreadSheetLayer CatalogSpreadSheetLayer
        {
            get { return catalogSpreadSheetLayer; }
            set { catalogSpreadSheetLayer = value; }
        }

        public bool DownloadComplete { get { return downloadComplete; } }

        private Dictionary<string, string> properties = new Dictionary<string, string>();
        private VoTable catalogVoTable = null;
        private SpreadSheetLayer catalogSpreadSheetLayer = new SpreadSheetLayer();

        private bool downloadComplete = false;
        private WebFile webFile;
        private readonly string url;
        private string datasetName;

        public HipsProperties (string datasetUrl, string datasetName)
        {
            this.datasetName = datasetName;
            if (datasetUrl.ToLowerCase().IndexOf("norder") > -1)
            {
                datasetUrl = datasetUrl.Substring(0, datasetUrl.ToLowerCase().IndexOf("norder"));
            }

            url = datasetUrl + "properties";

            Download();
        }

        private void Download()
        {
            webFile = new WebFile(url);
            webFile.OnStateChange = OnPropertiesDownloadComplete;
            webFile.Send();
        }

        private void OnPropertiesDownloadComplete()
        {
            if (webFile.State == StateType.Received)
            {
                ParseProperties(webFile.GetText());
                if (Properties.ContainsKey("dataproduct_type") && Properties["dataproduct_type"].ToLowerCase() == "catalog")
                {
                    catalogVoTable = VoTable.LoadFromUrl(url.Replace("/properties", "/metadata.xml"), OnCatalogMetadataDownloadComplete);
                } else
                {
                    downloadComplete = true;
                }
            }
        }

        private void OnCatalogMetadataDownloadComplete ()
        {
            catalogSpreadSheetLayer.UseHeadersFromVoTable(catalogVoTable);
            catalogSpreadSheetLayer.Name = datasetName;
            LayerManager.AddSpreadsheetLayer(CatalogSpreadSheetLayer, "Sky");
            downloadComplete = true;
        }

        private void ParseProperties(string data)
        {
            string[] lines = data.Split('\n');

            foreach (string line in lines)
            {
                if (!string.IsNullOrWhiteSpace(line) && !line.StartsWith("#"))
                {
                    string[] parts = line.Split('=');
                    if (parts.Length == 2)
                    {
                        string key = parts[0].Trim();
                        string val = parts[1].Trim();
                        if (!string.IsNullOrWhiteSpace(key) && !string.IsNullOrWhiteSpace(val))
                        {
                            Properties[key] = val;
                        }
                    }
                }
            }
        }
    }
}
