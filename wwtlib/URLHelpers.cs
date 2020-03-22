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
            Script.Literal("var parsed = new URL({0})", url);
            String lcdomain = ((string) Script.Literal("parsed.hostname")).ToLowerCase();
            String lcpath = ((string)Script.Literal("parsed.pathname")).ToLowerCase();

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
                        String rest = (string) Script.Literal("parsed.pathname + parsed.search + parsed.hash");
                        return this.core_static_baseurl + (string) rest;
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

        public static URLHelpers singleton;

        static URLHelpers() {
            singleton = new URLHelpers();
        }
    }
}
