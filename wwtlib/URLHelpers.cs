﻿// The helper class for rewriting URLs. This gets complicated, because we
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
        Dictionary<String, bool> flagship_static_lcpaths;

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

            this.flagship_static_lcpaths = new Dictionary<String, bool>();
            this.flagship_static_lcpaths["/wwtweb/2massoct.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/bingdemtile.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/bingdemtile2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/catalog.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/catalog2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/dem.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/dembath.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/demmars.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/demtile.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/dss.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/dsstoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/dusttoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/earthblend.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/earthmerbath.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/fixedaltitudedemtile.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/g360.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/galex4far.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/galex4near.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/galextoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/gettile.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/gettour.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/gettourfile.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/gettours.aspx"] = true; // maybe not?
            this.flagship_static_lcpaths["/wwtweb/glimpse.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/halphatoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/hirise.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/hirisedem2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/hirisedem3.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/jupiter.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/mandel.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/mandel1.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/mars.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/marsdem.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/marshirise.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/marsmoc.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/martiantile.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/martiantile2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/mipsgal.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/moondem.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/moonoct.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/moontoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/moontoastdem.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/postmars.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/postmarsdem.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/postmarsdem2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/rasstoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/sdsstoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/sdsstoast2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/sdsstoast2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/thumbnail.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/tiles.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/tiles2.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/tilesthumb.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/twomasstoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/tychooct.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/veblend.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/vlsstoast.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/wmap.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/wmsmoon.aspx"] = true;
            this.flagship_static_lcpaths["/wwtweb/wmstoast.aspx"] = true;
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
                    } else if (this.flagship_static_lcpaths.ContainsKey(lcpath)) {
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
