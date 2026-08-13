var REG_NONE = NewRegistrar("none");
var CLOUDFLARE = NewDnsProvider("cloudflare");
var CF_PROXY_OFF = { cloudflare_proxy: "off" };

D("mamahoos.ir", REG_NONE, DnsProvider(CLOUDFLARE), NO_PURGE,
  A("portfolio", "185.199.108.153", TTL(1), CF_PROXY_OFF),
  A("portfolio", "185.199.109.153", TTL(1), CF_PROXY_OFF),
  A("portfolio", "185.199.110.153", TTL(1), CF_PROXY_OFF),
  A("portfolio", "185.199.111.153", TTL(1), CF_PROXY_OFF),
);
