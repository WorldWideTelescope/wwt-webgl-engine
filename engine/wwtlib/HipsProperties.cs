using System;
using System.Collections.Generic;

namespace wwtlib
{

    public class HipsProperties
    {
        public Dictionary<string, string> Properties { get { return properties; } }
        public CatalogSpreadSheetLayer CatalogSpreadSheetLayer
        {
            get { return catalogSpreadSheetLayer; }
            set { catalogSpreadSheetLayer = value; }
        }

        public VoTable CatalogColumnInfo
        {
            get { return catalogColumnInfo; }
            set { catalogColumnInfo = value; }
        }

        public bool DownloadComplete { get { return downloadComplete; } }

        private Dictionary<string, string> properties = new Dictionary<string, string>();
        private VoTable catalogColumnInfo = null;
        private CatalogSpreadSheetLayer catalogSpreadSheetLayer = new CatalogSpreadSheetLayer();

        private bool downloadComplete = false;
        private WebFile webFile;
        private readonly string url;
        private string datasetName;
        private Action onDownloadComplete;

        public Imageset dataset;

        public HipsProperties (Imageset dataset)
        {
            this.dataset = dataset;
            this.datasetName = dataset.Name;
            url = dataset.Url;
            if (url.ToLowerCase().IndexOf("norder") > -1)
            {
                url = url.Substring(0, url.ToLowerCase().IndexOf("norder"));
            }

            url += "properties";

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
                    catalogColumnInfo = VoTable.LoadFromUrl(url.Replace("/properties", "/metadata.xml"), OnCatalogMetadataDownloadComplete);
                } else
                {
                    if (Properties.ContainsKey("hips_data_range"))
                    {
                        string hips_data_range = Properties["hips_data_range"];
                        this.dataset.FitsProperties.MinVal = Double.Parse(hips_data_range.Split(" ")[0]);
                        this.dataset.FitsProperties.MaxVal = Double.Parse(hips_data_range.Split(" ")[1]);
                        this.dataset.FitsProperties.LowerCut = this.dataset.FitsProperties.MinVal;
                        this.dataset.FitsProperties.UpperCut = this.dataset.FitsProperties.MaxVal;
                    }
                    if (Properties.ContainsKey("hips_pixel_cut"))
                    {
                        string hips_pixel_cut = Properties["hips_pixel_cut"];
                        this.dataset.FitsProperties.LowerCut = Double.Parse(hips_pixel_cut.Split(" ")[0]);
                        this.dataset.FitsProperties.UpperCut = Double.Parse(hips_pixel_cut.Split(" ")[1]);
                        if(!Properties.ContainsKey("hips_data_range"))
                        {
                            this.dataset.FitsProperties.MinVal = this.dataset.FitsProperties.LowerCut;
                            this.dataset.FitsProperties.MaxVal = this.dataset.FitsProperties.UpperCut;
                        }

                            
                    }
                    downloadComplete = true;
                    if(onDownloadComplete != null)
                    {
                        onDownloadComplete.Invoke();
                    }
                }
            }
        }

        private void OnCatalogMetadataDownloadComplete ()
        {
            catalogSpreadSheetLayer.UseHeadersFromVoTable(catalogColumnInfo);
            catalogSpreadSheetLayer.Name = datasetName;
            catalogSpreadSheetLayer.ID = new Guid();
            LayerManager.AddSpreadsheetLayer(CatalogSpreadSheetLayer, "Sky");
            downloadComplete = true;
            if (onDownloadComplete != null)
            {
                onDownloadComplete.Invoke();
            }
        }

        public void SetDownloadCompleteListener(Action listener)
        {
            this.onDownloadComplete = listener;
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
