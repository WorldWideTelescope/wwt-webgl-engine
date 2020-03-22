// The helper class for rewriting URLs. This gets complicated, because we
// might need to proxy for CORS headers and/or HTTPS support, *and* we
// sometimes also want to change the host and/or path to allow the engine or
// the webclient to swap out the data backend or the frontend.

using System;
using System.Collections.Generic;

namespace wwtlib
{
    enum DomainHandling
    {
        WWTFlagship = 0, // this host is worldwidetelescope.org or an equivalent
        Localhost = 1, // this host is localhost or an equivalent
        TryNoProxy = 2,  // none of the above, and we hope that we can get data from it without needing to use our proxy
        Proxy = 3, // none of the above, and we need to proxy it for HTTPS/CORS reasons
    }

    public class URLHelpers
    {
        String origin_protocol;  // this will be "http:" or "https:"
        String origin_domain;  // host name, no port number
        String core_static_baseurl;  // baseurl for core static assets: NB, includes things like wwt.o/wwtweb/dss.aspx
        String core_dynamic_baseurl;  // baseurl for core dynamic services
        Dictionary<String, DomainHandling> domain_handling;

        public URLHelpers() {
            this.origin_protocol = (string) Script.Literal("window.location.protocol");
            this.origin_domain = (string) Script.Literal("window.location.hostname");
            this.domain_handling = new Dictionary<string, DomainHandling>();
            this.domain_handling["worldwidetelescope.org"] = DomainHandling.WWTFlagship;
            this.domain_handling["www.worldwidetelescope.org"] = DomainHandling.WWTFlagship;
            this.domain_handling["cdn.worldwidetelescope.org"] = DomainHandling.WWTFlagship;
            this.domain_handling["content.worldwidetelescope.org"] = DomainHandling.WWTFlagship;
            this.domain_handling["beta.worldwidetelescope.org"] = DomainHandling.WWTFlagship;
            this.domain_handling["beta-cdn.worldwidetelescope.org"] = DomainHandling.WWTFlagship;
            this.domain_handling["wwtstaging.azurewebsites.net"] = DomainHandling.WWTFlagship;
            this.domain_handling["localhost"] = DomainHandling.Localhost;
            this.domain_handling["127.0.0.1"] = DomainHandling.Localhost;

            switch (this.origin_domain)
            {
                case "worldwidetelescope.org":
                case "www.worldwidetelescope.org":
                case "cdn.worldwidetelescope.org":
                    this.core_static_baseurl = this.origin_protocol + "//cdn.worldwidetelescope.org";
                    this.core_dynamic_baseurl = this.origin_protocol + "//worldwidetelescope.org";
                    break;

                case "beta.worldwidetelescope.org":
                case "beta-cdn.worldwidetelescope.org":
                    this.core_static_baseurl = this.origin_protocol + "//beta-cdn.worldwidetelescope.org";
                    this.core_dynamic_baseurl = this.origin_protocol + "//beta.worldwidetelescope.org";
                    break;

                default:
                    this.core_static_baseurl = this.origin_protocol + "//beta-cdn.worldwidetelescope.org"; // TEMPORARY
                    this.core_dynamic_baseurl = this.origin_protocol + "//beta.worldwidetelescope.org";
                    break;
            }
        }

        public String rewrite(String url) {
            // Sadly, we can't take advantage of JS/browser URL parsing
            // because this function might be passed template URLs like
            // "http://r{S:2}.ortho.tiles.virtualearth.net/..." that won't
            // parse. So we have to split up the URL manually.

            string lc = url.ToLowerCase();
            string lcproto;
            string url_no_protocol;

            if (lc.StartsWith("http://")) {
                lcproto = "http:";
                url_no_protocol = url.Substring(7);
            } else if (lc.StartsWith("https://")) {
                lcproto = "https:";
                url_no_protocol = url.Substring(8);
            } else if (lc.StartsWith("//")) {
                lcproto = "";
                url_no_protocol = url.Substring(2);
            } else {
                // TODO: we're assuming that we got something like
                // 'example.com/foo', but we might have gotten a relative URL
                // like 'path/subdir'. Or "ftp://..."?
                lcproto = "";
                url_no_protocol = url;
            }

            string lcdomain;
            string path;
            int slash_index = url_no_protocol.IndexOf('/');

            if (slash_index < 0) {
                lcdomain = url_no_protocol;
                path = "/";
            } else {
                lcdomain = url_no_protocol.Substring(0, slash_index).ToLowerCase();
                path = url_no_protocol.Substring(slash_index); // starts with "/"
            }

            string lcpath = path.ToLowerCase();

            if (!this.domain_handling.ContainsKey(lcdomain))
                this.domain_handling[lcdomain] = DomainHandling.TryNoProxy;

            DomainHandling mode = this.domain_handling[lcdomain];

            switch (mode)
            {
                case DomainHandling.TryNoProxy:
                case DomainHandling.Localhost:
                default:
                    return url;

                case DomainHandling.Proxy:
                    return this.core_dynamic_baseurl + "/webserviceproxy.aspx?targeturl=" + url.EncodeUriComponent();

                case DomainHandling.WWTFlagship:
                    if (lcpath.StartsWith("/wwtweb/"))
                    {
                        return this.core_static_baseurl + path;
                    }
                    return url;
            }
        }

        public string engineAssetUrl(string subpath)
        {
            return String.Format("{0}/engine/assets/{1}", this.core_static_baseurl, subpath);
        }

        public string coreDynamicUrl(string subpath)
        {
            return String.Format("{0}/{1}", this.core_dynamic_baseurl, subpath);
        }

        public string coreStaticUrl(string subpath)
        {
            return String.Format("{0}/{1}", this.core_static_baseurl, subpath);
        }

        public static URLHelpers singleton;

        static URLHelpers() {
            singleton = new URLHelpers();
        }
    }
}
