// The helper class for rewriting URLs. This gets complicated, because we
// might need to proxy for CORS headers and/or HTTPS support, *and* we
// sometimes also want to change the host and/or path to allow the engine or
// the webclient to swap out the data backend or the frontend.

using System;

namespace wwtlib
{
    public class URLHelpers
    {
        String origin_protocol;

        public URLHelpers() {
            this.origin_protocol = (string) Script.Literal("window.location.protocol");
        }

        public String rewrite(String url) {
            return url;
        }

        public static URLHelpers singleton;

        static URLHelpers() {
            singleton = new URLHelpers();
        }
    }
}
