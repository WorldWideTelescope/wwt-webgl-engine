using System;
using System.Collections.Generic;

namespace wwtlib
{

    public class HipsProperties
    {
        public Dictionary<string, string> Properties = new Dictionary<string, string>();
        public VoTable VoTable = null;
        public bool downloadComplete = false;
        private WebFile webFile;
        public static HipsProperties GetPropertiesCat(string url)
        {
            HipsProperties props = new HipsProperties();
            string propsUrl = url.Substring(0, url.IndexOf("/Norder")) + "/properties";
            //string tableUrl = propsUrl.Replace("/properties", "/metadata.xml");
            //string tableFilename = filename.Replace("\\properties", "\\metadata.xml");
            //string path = filename.Replace("\\properties", "\\");

            //try
            //{
            //    if (!hipsPropertiesDictionary.ContainsKey(propsUrl))
            //    {
            //        hipsPropertiesDictionary.Add(propsUrl, props);
            //        //startDownload

            //    }

            //    string[] lines = File.ReadAllLines(filename);

            //    foreach (string line in lines)
            //    {
            //        if (!string.IsNullOrWhiteSpace(line) && !line.StartsWith("#"))
            //        {
            //            string[] parts = line.Split('=');
            //            string key = parts[0].Trim();
            //            string val = parts[1].Trim();
            //            if (!string.IsNullOrWhiteSpace(key) && !string.IsNullOrWhiteSpace(val))
            //            {
            //                props.Properties[key] = val;
            //            }
            //        }
            //    }

            //    // now download the catalog
            //    if (props.Properties.ContainsKey("dataproduct_type") && props.Properties["dataproduct_type"] == "catalog")
            //    {
            //        if (!File.Exists(tableFilename))
            //        {
            //            WebClient client = new WebClient();
            //            client.DownloadFile(tableUrl, tableFilename);
            //        }

            //        props.VoTable = new VoTable(tableFilename);
            //    }
            //}
            //catch
            //{
            //    props.Properties["dummy"] = "failed";
            //}

            ValidateProperties(props);

            return props;
        }

        public static HipsProperties GetProperties(string url)
        {
            HipsProperties props = new HipsProperties();
            string propsUrl = "";

            if (url.ToLowerCase().IndexOf("norder") > -1)
            {
                url = url.Substring(0, url.ToLowerCase().IndexOf("norder"));
            }

            propsUrl = url + "properties";

            try
            {
                props.Download(propsUrl);

                // now download the catalog
                //if (props.Properties.ContainsKey("dataproduct_type") && props.Properties["dataproduct_type"] == "catalog")
                //{
                //    string tableUrl = propsUrl.Replace("/properties", "/metadata.xml");

                //    client = new WebClient();
                //    string voTable = client.DownloadString(tableUrl);

                //    System.Xml.XmlDocument xmlDocument = new System.Xml.XmlDocument();
                //    xmlDocument.LoadXml(voTable);
                //    props.VoTable = new VoTable(xmlDocument);
                //}
            }
            catch
            {
                props.Properties["dummy"] = "failed";
            }
            ValidateProperties(props);
            return props;
        }

        private void Download(string propsUrl)
        {
            webFile = new WebFile(propsUrl);
            webFile.OnStateChange = LoadData;
            webFile.Send();
        }

        private void LoadData()
        {
            if (webFile.State == StateType.Error)
            {
                Script.Literal("alert({0})", webFile.Message);
            }
            else if (webFile.State == StateType.Received)
            {
                string data = webFile.GetText();

                string[] lines = data.Split('\n');
                foreach (string line in lines)
                {
                    if (!string.IsNullOrWhiteSpace(line) && !line.StartsWith("#"))
                    {
                        string[] parts = line.Split('=');
                        string key = parts[0].Trim();
                        string val = parts[1].Trim();
                        if (!string.IsNullOrWhiteSpace(key) && !string.IsNullOrWhiteSpace(val))
                        {
                            Properties[key] = val;
                        }
                    }
                }
            }
            downloadComplete = true;
        }

        public static void ValidateProperties(HipsProperties props)
        {
            if (props.Properties.Count == 1)
            {
                return;
            }
            if (!props.Properties.ContainsKey("obs_title"))
            {
                if (props.Properties.ContainsKey("creator_did"))
                {
                    props.Properties["obs_title"] = props.Properties["creator_did"];
                }
                else
                {
                    props.Properties["obs_title"] = "No Title";
                }
            }
        }

        public static bool IsValid(HipsProperties props)
        {
            if (props.Properties.Count == 1)
            {
                return false;
            }
            if (!props.Properties.ContainsKey("obs_title"))
            {
                return false;
            }
            if (!props.Properties.ContainsKey("hips_tile_format"))
            {
                return false;
            }
            if (!props.Properties.ContainsKey("hips_service_url"))
            {
                return false;
            }
            if (!props.Properties.ContainsKey("hips_order"))
            {
                return false;
            }
            if (!props.Properties.ContainsKey("dataproduct_type"))
            {
                return false;
            }
            if (props.Properties["dataproduct_type"] == "cube")
            {
                return false;
            }
            if (props.Properties.ContainsKey("client_category") && props.Properties["client_category"].ToLowerCase().IndexOf("solar") > -1)
            {
                return false;
            }
            return true;
        }

        public static HipsProperties ParseProperties(string data)
        {
            HipsProperties props = new HipsProperties();
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
                            props.Properties[key] = val;
                        }
                    }
                }
            }

            ValidateProperties(props);
            return props;
        }
        public static void LoadProperties(Imageset dataset)
        {
            dataset.HipsProperties = HipsProperties.GetProperties(dataset.Url);
            //dataset.Properties = props.Properties;
            //dataset.TableMetadata = props.VoTable;
        }
    }


}
