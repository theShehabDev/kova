<?php
/**
NOT USED ANYMORE AFTER XPAY FIXED CSP
 * Plugin Name: KOVA CSP Fix
 * Description: Adds the WordPress asset origin to the Content-Security-Policy meta tag injected by the payment gateway plugin. Without this, every script served from shop.kovacompounds.com is blocked and the block checkout never renders.
 * Version: 1.0.0
 * Author: ShehabDev
 */

if (!defined('ABSPATH')) {
    exit;
}

function kova_csp_asset_origin() {
    $site = site_url();          // where WP's files live  (shop.*)
    $home = home_url();          // where pages are served (root domain)

    $site_host = wp_parse_url($site, PHP_URL_HOST);
    $home_host = wp_parse_url($home, PHP_URL_HOST);

    if (!$site_host || $site_host === $home_host) {
        return '';
    }

    $scheme = wp_parse_url($site, PHP_URL_SCHEME) ?: 'https';
    return $scheme . '://' . $site_host;
}

// Origins to add, keyed by the directives each one belongs in.
function kova_csp_origins() {
    $map = [];

    $origin = kova_csp_asset_origin();
    if ($origin) {
        $map[$origin] = ['script-src', 'img-src', 'style-src', 'connect-src', 'font-src', 'frame-src'];
    }

    $map['https://secure.gravatar.com'] = ['img-src'];
    $map['https://*.gravatar.com']      = ['img-src'];

    // GreenPay. The gateway CSP only lists its own payment hosts, so a second
    // gateway is blocked on the same checkout. portal.ribbit.ai is the ValidFi
    // Bank Login widget and is framed, not just fetched.
    $map['https://portal.ribbit.ai'] = ['frame-src', 'child-src', 'script-src', 'connect-src'];
    $map['https://*.ribbit.ai']      = ['frame-src', 'child-src', 'script-src', 'connect-src'];
    $map['https://greenbyphone.com'] = ['script-src', 'connect-src', 'frame-src'];

    return apply_filters('kova_csp_origins', $map);
}

// Insert each origin into the directives it belongs to.
function kova_csp_patch($html) {
    $origins = kova_csp_origins();
    if (!$origins) {
        return $html;
    }

    return preg_replace_callback(
        '#<meta[^>]+http-equiv=["\']Content-Security-Policy["\'][^>]*>#i',
        function ($m) use ($origins) {
            $tag = $m[0];

            foreach ($origins as $origin => $directives) {
                // Already present — a cached fragment, or the gateway added it
                if (strpos($tag, $origin) !== false) {
                    continue;
                }
                foreach ($directives as $directive) {
                    // Append the origin immediately after the directive name,
                    $tag = preg_replace(
                        '#(\b' . preg_quote($directive, '#') . '\s)#i',
                        '$1' . $origin . ' ',
                        $tag,
                        1
                    );
                }
            }
            return $tag;
        },
        $html,
        1 // one CSP tag per document
    );
}

// Buffer the whole response and patch on shutdown.
add_action('template_redirect', function () {
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return;
    }

    ob_start('kova_csp_patch');
}, 0);
