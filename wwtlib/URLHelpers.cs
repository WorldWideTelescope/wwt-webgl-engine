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
        bool force_https;
        String core_static_baseurl;  // baseurl for core static assets: NB, includes things like wwt.o/wwtweb/dss.aspx
        String core_dynamic_baseurl;  // baseurl for core dynamic services
        Dictionary<String, DomainHandling> domain_handling;
        HashSet<String> flagship_static_lcpaths;

        public URLHelpers() {
            this.origin_protocol = (string) Script.Literal("window.location.protocol");
            this.origin_domain = (string) Script.Literal("window.location.hostname");
            this.force_https = (this.origin_protocol == "https:");

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

            this.flagship_static_lcpaths = new HashSet<String>();
            this.flagship_static_lcpaths.Add("/wwtweb/2massoct.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/bingdemtile.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/bingdemtile2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/catalog.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/catalog2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/dem.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/dembath.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/demmars.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/demtile.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/dss.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/dsstoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/dusttoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/earthblend.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/earthmerbath.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/fixedaltitudedemtile.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/g360.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/galex4far.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/galex4near.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/galextoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/gettile.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/gettour.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/gettourfile.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/gettours.aspx"); // maybe not?
            this.flagship_static_lcpaths.Add("/wwtweb/glimpse.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/halphatoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/hirise.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/hirisedem2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/hirisedem3.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/jupiter.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/mandel.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/mandel1.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/mars.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/marsdem.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/marshirise.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/marsmoc.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/martiantile.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/martiantile2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/mipsgal.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/moondem.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/moonoct.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/moontoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/moontoastdem.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/postmars.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/postmarsdem.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/postmarsdem2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/rasstoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/sdsstoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/sdsstoast2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/sdsstoast2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/thumbnail.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/tiles.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/tiles2.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/tilesthumb.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/twomasstoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/tychooct.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/veblend.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/vlsstoast.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/wmap.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/wmsmoon.aspx");
            this.flagship_static_lcpaths.Add("/wwtweb/wmstoas.aspx");
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
            string rest; // potentially "/foo/CASE/bar?q=1&b=1#fragment"
            int slash_index = url_no_protocol.IndexOf('/');

            if (slash_index < 0) {
                lcdomain = url_no_protocol;
                rest = "/";
            } else {
                lcdomain = url_no_protocol.Substring(0, slash_index).ToLowerCase();
                rest = url_no_protocol.Substring(slash_index); // starts with "/"
            }

            string lcpath = rest.ToLowerCase().Split('?')[0];

            if (!this.domain_handling.ContainsKey(lcdomain))
                this.domain_handling[lcdomain] = DomainHandling.TryNoProxy;

            DomainHandling mode = this.domain_handling[lcdomain];

            switch (mode)
            {
                case DomainHandling.Localhost:
                    return url;  // can't proxy, so we'll just have to hope it works

                case DomainHandling.TryNoProxy:
                default:
                    if (this.force_https && lcproto != "https:") {
                        // Force HTTPS and we'll see what happens. If
                        // downloading fails, we'll set a flag and use our
                        // proxy to launder the security.
                        return "https://" + lcdomain + rest;
                    }
                    return url;

                case DomainHandling.Proxy:
                    return this.core_dynamic_baseurl + "/webserviceproxy.aspx?targeturl=" + url.EncodeUriComponent();

                case DomainHandling.WWTFlagship:
                    // Rewrite "flagship"/core URLs to go through whatever our
                    // core bases are. Assume that URLs are dynamic (=> are
                    // not loaded through the CDN) unless proven otherwise.
                    bool is_static = false;

                    if (lcpath.StartsWith("/data/")) {
                        is_static = true;
                    } else if (this.flagship_static_lcpaths.Contains(lcpath)) {
                        is_static = true;
                    } else if (lcpath.StartsWith("/content/")) {
                        is_static = true;
                    }

                    if (is_static)
                        return this.core_static_baseurl + rest;
                    return this.core_dynamic_baseurl + rest;
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
