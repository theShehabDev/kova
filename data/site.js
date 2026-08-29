// Central content model for the KOVA site.
//
// Products live in WooCommerce and are fetched via lib/woo.js. What remains
// here is design/content data that isn't part of the store.
//
// ── REMOVED IN THE COMPLIANCE CLEANUP ────────────────────────────────────
// Three arrays came out of this file: `categories`, `protocols`, and
// `articles`. All three were full of human-benefit language ("Rapid Recovery
// Protocol", "soft tissue repair", "downtime between hard training blocks",
// "healthy aging", "energy, balance, and wellness"), which contradicts the
// research-use-only position stated in the footer and on every product page.
//
// None of them rendered anywhere — the components that read them were already
// unmounted and have been deleted alongside. They're gone rather than
// commented so a future compliance grep over this repo comes back clean
// instead of turning up copy that reads like it's still in use.
//
// Product categories are a live WooCommerce field (see lib/woo.js) and are
// edited in wp-admin, not here.
// ─────────────────────────────────────────────────────────────────────────

// Batch records and COAs are no longer here. They live in WordPress, in the
// KOVA Batches & COAs plugin (woocommerce/kova-batches), and are fetched by
// lib/batches.js.
//
// What was here was four placeholders with test dates in the future and COA
// links that pointed at "#". They are gone rather than commented out, so a
// compliance grep over this repo does not turn up fabricated purity results
// that read like they are still in use.
