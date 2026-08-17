var REG_NONE = NewRegistrar("none");
var CLOUDFLARE = NewDnsProvider("cloudflare", {
  // Owns Single Redirects for this zone. Extra dashboard redirects
  // would be deleted on the next push.
  manage_single_redirects: true,
});
var CF_PROXY_OFF = { cloudflare_proxy: "off" };
var CF_PROXY_ON = { cloudflare_proxy: "on" };

D("mamahoos.ir", REG_NONE, DnsProvider(CLOUDFLARE), NO_PURGE,
  A("portfolio", "185.199.108.153", TTL(1), CF_PROXY_OFF),
  A("portfolio", "185.199.109.153", TTL(1), CF_PROXY_OFF),
  A("portfolio", "185.199.110.153", TTL(1), CF_PROXY_OFF),
  A("portfolio", "185.199.111.153", TTL(1), CF_PROXY_OFF),
  // Shortcut only. Orange-cloud so the Single Redirect can fire.
  // Canonical site stays portfolio.mamahoos.ir on GitHub Pages.
  CNAME("resume", "portfolio.mamahoos.ir.", CF_PROXY_ON),
  CF_SINGLE_REDIRECT(
    "shortcut resume.mamahoos.ir to /resume/",
    301,
    'http.host eq "resume.mamahoos.ir"',
    'concat("https://portfolio.mamahoos.ir/resume/", "")'
  ),
);
