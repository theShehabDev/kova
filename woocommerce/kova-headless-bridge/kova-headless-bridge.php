<?php
/**
 * Plugin Name: KOVA Headless Bridge
 * Description: Accepts a signed cart from the Next.js storefront, fills the WooCommerce cart with it, and redirects to checkout. Also loads the storefront stylesheet on the shopper-facing WooCommerce pages, which hides the theme header. Nothing else: no filters, no output buffering, and nothing that touches checkout behaviour.
 * Version: 4.0.0
 * Author: ShehabDev
 */

if (!defined('ABSPATH')) {
    exit;
}

// Settings: WooCommerce -> KOVA Bridge

add_action('admin_menu', function () {
    add_submenu_page(
        'woocommerce',
        'KOVA Bridge',
        'KOVA Bridge',
        'manage_options',
        'kova-bridge',
        'kova_bridge_settings_page'
    );
});

add_action('admin_init', function () {
    register_setting('kova_bridge', 'kova_bridge_secret');
    register_setting('kova_bridge', 'kova_bridge_storefront');
});

function kova_bridge_settings_page() {
    ?>
    <div class="wrap">
        <h1>KOVA Headless Bridge</h1>
        <p>Receives the signed cart from the Next.js storefront and sends the shopper to checkout.</p>
        <form method="post" action="options.php">
            <?php settings_fields('kova_bridge'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="kova_bridge_storefront">Storefront URL</label></th>
                    <td>
                        <input type="url" class="regular-text" id="kova_bridge_storefront"
                               name="kova_bridge_storefront"
                               value="<?php echo esc_attr(get_option('kova_bridge_storefront', '')); ?>"
                               placeholder="https://kovacompounds.com">
                        <p class="description">Your Next.js site, no trailing slash.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="kova_bridge_secret">Cart secret</label></th>
                    <td>
                        <input type="text" class="regular-text code" id="kova_bridge_secret"
                               name="kova_bridge_secret"
                               value="<?php echo esc_attr(get_option('kova_bridge_secret', '')); ?>">
                        <p class="description">
                            Must match <code>KOVA_CART_SECRET</code> in the Next.js environment.
                            Use a long random string.
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Storefront skin on the pages shoppers actually see.
//
// A stylesheet and nothing more. It cannot alter checkout behaviour: no
// scripts, no hooks into the order, no markup. The theme header is hidden by
// a rule inside the CSS, not by unhooking anything in PHP, so WooCommerce and
// the theme still run exactly as they would without this plugin.

add_action('wp_enqueue_scripts', function () {
    if (!function_exists('is_checkout')) {
        return;
    }
    if (!is_checkout() && !is_cart() && !is_account_page() && !is_wc_endpoint_url()) {
        return;
    }

    // Depend on the theme's stylesheets so ours always prints after them.
    // Checked rather than named outright: naming an unregistered handle makes
    // WordPress skip the stylesheet entirely, so a theme change would silently
    // unstyle the whole checkout.
    $deps = [];
    foreach (['storefront-style', 'storefront-woocommerce-style'] as $handle) {
        if (wp_style_is($handle, 'registered') || wp_style_is($handle, 'enqueued')) {
            $deps[] = $handle;
        }
    }

    $file = plugin_dir_path(__FILE__) . 'assets/kova-woo.css';

    wp_enqueue_style(
        'kova-woo',
        plugin_dir_url(__FILE__) . 'assets/kova-woo.css',
        $deps,
        // Cache-bust on file change rather than plugin version.
        file_exists($file) ? (string) filemtime($file) : '4.0.0'
    );
}, 30);

// Cart handoff: ?kova-cart=<id>:<variation_id>:<qty>,...&sig=<hmac>
//
// Runs solely when kova-cart is present in the query string, and returns
// immediately otherwise, so no checkout, cart or account request is touched.

add_action('template_redirect', function () {
    if (empty($_GET['kova-cart'])) {
        return;
    }

    $secret = get_option('kova_bridge_secret', '');
    if (empty($secret)) {
        wp_die('KOVA Bridge is not configured: no cart secret set.', 'Setup error', ['response' => 500]);
    }

    $payload = sanitize_text_field(wp_unslash($_GET['kova-cart']));
    $sig     = isset($_GET['sig']) ? sanitize_text_field(wp_unslash($_GET['sig'])) : '';

    // The signature is what stops anyone crafting carts against the store.
    if (!hash_equals(hash_hmac('sha256', $payload, $secret), $sig)) {
        wp_die('Invalid cart signature.', 'Cart error', ['response' => 400]);
    }

    // Referral riding along on the handoff, signed with the same secret.
    if (!empty($_GET['ref']) && !empty($_GET['refsig']) && function_exists('kova_set_ref_cookie')) {
        $ref    = sanitize_text_field(wp_unslash($_GET['ref']));
        $refsig = sanitize_text_field(wp_unslash($_GET['refsig']));
        if (hash_equals(hash_hmac('sha256', $ref, $secret), $refsig)) {
            kova_set_ref_cookie($ref);
        }
    }

    if (!function_exists('WC')) {
        return;
    }

    // On some hosts the cart/session is not booted this early.
    if (null === WC()->cart && function_exists('wc_load_cart')) {
        wc_load_cart();
    }
    if (null === WC()->cart) {
        return;
    }

    WC()->cart->empty_cart();

    foreach (explode(',', $payload) as $pair) {
        $parts = array_map('trim', explode(':', $pair));
        $id    = isset($parts[0]) ? absint($parts[0]) : 0;

        if (count($parts) >= 3) {
            $variation_id = absint($parts[1]);
            $qty          = max(1, absint($parts[2]));
        } else {
            // Legacy two-part payload: no variation.
            $variation_id = 0;
            $qty          = isset($parts[1]) ? max(1, absint($parts[1])) : 1;
        }

        if (!$id) {
            continue;
        }

        $variation_attrs = [];
        if ($variation_id) {
            $variation = wc_get_product($variation_id);
            if ($variation && $variation->is_type('variation') && $variation->get_parent_id() === $id) {
                $variation_attrs = $variation->get_variation_attributes();
            } else {
                // Variation deleted, or not a child of this product.
                continue;
            }
        }

        WC()->cart->add_to_cart($id, $qty, $variation_id, $variation_attrs);
    }

    wp_safe_redirect(wc_get_checkout_url());
    exit;
});
