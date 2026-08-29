// Redirects, plus WordPress proxy rewrites for single-domain mode.
const WP_ORIGIN = process.env.WP_ORIGIN;

const wpPaths = ["checkout", "cart", "my-account", "wp-json", "wp-admin"];

const wooProductBases = ["product"];
const wooCategoryBases = ["product-category", "product-cat"];

const nextConfig = {
  reactStrictMode: true,

  trailingSlash: true,

  // Keep the slashed URLs, drop the 308 that enforced them. That redirect hit
  // /wp-json too, and a redirect is illegal on a CORS preflight, so the Store
  // API call died with "Redirect is not allowed for a preflight request".
  // It also breaks server-to-server callers that don't follow 308 — Green.Money
  // calls the WooCommerce REST API this way.
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      { source: "/catalog", destination: "/products", permanent: true },
      { source: "/catalog/:slug", destination: "/products/:slug", permanent: true },

      ...wooProductBases.map((base) => ({
        source: `/${base}/:slug`,
        destination: "/products/:slug",
        permanent: true,
      })),
      ...wooProductBases.map((base) => ({
        source: `/${base}/:path*/:slug`,
        destination: "/products/:slug",
        permanent: true,
      })),
      ...wooCategoryBases.map((base) => ({
        source: `/${base}/:slug`,
        destination: "/products/?category=:slug",
        permanent: true,
      })),
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/product-tag/:slug", destination: "/products", permanent: true },
    ];
  },

  async rewrites() {
    if (!WP_ORIGIN) return { beforeFiles: [], afterFiles: [] };

    const origin = WP_ORIGIN.replace(/\/$/, "");

    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "query", key: "wc-ajax" }],
          destination: `${origin}/`,
        },
        {
          source: "/",
          has: [{ type: "query", key: "kova-cart" }],
          destination: `${origin}/`,
        },
      ],

      afterFiles: [
      { source: "/wp-login.php", destination: `${origin}/wp-login.php` },

      ...wpPaths.flatMap((p) => {
        const isFileRoute = p === "wp-json" || p === "wp-admin";
        return [
          {
            source: `/${p}`,
            destination: p === "wp-json" ? `${origin}/${p}` : `${origin}/${p}/`,
          },
          {
            source: `/${p}/:path*`,
            destination: `${origin}/${p}/:path*${isFileRoute ? "" : "/"}`,
          },
        ];
      }),
      ],
    };
  },
};

export default nextConfig;
