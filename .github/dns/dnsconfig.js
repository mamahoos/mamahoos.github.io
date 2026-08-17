var REG_NONE = NewRegistrar("none");
var CLOUDFLARE = NewDnsProvider("cloudflare", {
  // Owns Single Redirects for this zone. Extra dashboard redirects
  // would be deleted on the next push.
  manage_single_redirects: true,
});
var CF_PROXY_OFF = { cloudflare_proxy: "off" };
var CF_PROXY_ON = { cloudflare_proxy: "on" };

D("mamahoos.ir", REG_NONE, DnsProvider(CLOUDFLARE), NO_PURGE,
  // Canonical site. Grey-cloud so GitHub can issue the Pages cert.
  // https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain
  A("@", "185.199.108.153", TTL(1), CF_PROXY_OFF),
  A("@", "185.199.109.153", TTL(1), CF_PROXY_OFF),
  A("@", "185.199.110.153", TTL(1), CF_PROXY_OFF),
  A("@", "185.199.111.153", TTL(1), CF_PROXY_OFF),
  // GitHub Pages always checks www when the custom domain is the apex.
  // Point at github.io, not the apex, or HTTPS enforce breaks.
  // https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain-and-the-www-subdomain-variant
  CNAME("www", "mamahoos.github.io.", CF_PROXY_OFF),

  // Old hostname. Keep the A records (NO_PURGE would leave them if
  // swapped for a CNAME) and orange-cloud so the 301 can fire.
  A("portfolio", "185.199.108.153", TTL(1), CF_PROXY_ON),
  A("portfolio", "185.199.109.153", TTL(1), CF_PROXY_ON),
  A("portfolio", "185.199.110.153", TTL(1), CF_PROXY_ON),
  A("portfolio", "185.199.111.153", TTL(1), CF_PROXY_ON),
  CF_SINGLE_REDIRECT(
    "301 portfolio.mamahoos.ir to mamahoos.ir",
    301,
    'http.host eq "portfolio.mamahoos.ir"',
    'concat("https://mamahoos.ir", http.request.uri.path)'
  ),

  // Shortcut only. Orange-cloud so the Single Redirect can fire.
  // Not a GitHub Pages custom domain.
  CNAME("resume", "mamahoos.ir.", CF_PROXY_ON),
  CF_SINGLE_REDIRECT(
    "shortcut resume.mamahoos.ir to /resume/",
    301,
    'http.host eq "resume.mamahoos.ir"',
    'concat("https://mamahoos.ir/resume/", "")'
  ),
);
