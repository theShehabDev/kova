<?php
/**
 * Plugin Name: KOVA Affiliates
 * Description: A closed affiliate programme with sponsor codes. Approved affiliates get a private code worth 10% off to the buyer and 15% commission to them on the discounted total. Sponsors hold the same kind of code with recruiting rights: anyone joining the programme can enter it to join that sponsor's team, earning the sponsor 2.5% of their sales on top. Sponsor codes can be issued before the person has an account and are claimed on signup. Balances accrue in wp-admin and are paid offline, with a reset button per affiliate.
 * Version: 1.3.0
 * Author: ShehabDev
 */

if (!defined('ABSPATH')) {
    exit;
}

// Configuration

const KOVA_AFF_DISCOUNT = 10;   // % off for the buyer using an affiliate code
const KOVA_AFF_RATE     = 15;   // % commission to the affiliate
const KOVA_AFF_OVERRIDE = 2.5;  // % to the affiliate who recruited them

// THE OVERRIDE, in plain terms.

const KOVA_AFF_COOKIE = 'kova_aff';
const KOVA_AFF_DAYS   = 60;

// Application states. A user with no status has never applied.
const KOVA_AFF_PENDING  = 'pending';
const KOVA_AFF_ACTIVE   = 'active';
const KOVA_AFF_REJECTED = 'rejected';

// Status

function kova_aff_status($user_id) {
    return (string) get_user_meta($user_id, 'kova_aff_status', true);
}

function kova_aff_is_active($user_id) {
    return $user_id && kova_aff_status($user_id) === KOVA_AFF_ACTIVE;
}

function kova_aff_auto_approve() {
    return get_option('kova_aff_auto_approve') === 'yes';
}

// Codes

function kova_aff_code($user_id) {
    $code = get_user_meta($user_id, 'kova_aff_code', true);
    if ($code) {
        return $code;
    }

    do {
        $code = 'KV' . strtoupper(wp_generate_password(6, false, false));
    } while (kova_aff_user_by_code($code));

    update_user_meta($user_id, 'kova_aff_code', $code);
    return $code;
}

function kova_aff_user_by_code($code) {
    if (!$code) {
        return 0;
    }
    $users = get_users([
        'meta_key'   => 'kova_aff_code',
        'meta_value' => strtoupper($code),
        'number'     => 1,
        'fields'     => 'ID',
    ]);
    return $users ? (int) $users[0] : 0;
}

// The affiliate who recruited this one, or 0.
function kova_aff_sponsor($user_id) {
    return (int) get_user_meta($user_id, 'kova_aff_sponsor', true);
}

function kova_aff_can_sponsor($sponsor_id, $user_id) {
    if (!$sponsor_id || $sponsor_id === $user_id) {
        return false;
    }
    $seen = $sponsor_id;
    for ($i = 0; $i < 10; $i++) {
        $seen = kova_aff_sponsor($seen);
        if (!$seen) {
            return true;
        }
        if ($seen === $user_id) {
            return false;
        }
    }
    return false;
}

// Sponsor codes

const KOVA_AFF_CODES_OPTION = 'kova_aff_sponsor_codes';
const KOVA_SPONSOR_COOKIE   = 'kova_sponsor';

// The registry, keyed by uppercased code.
function kova_aff_codes() {
    $codes = get_option(KOVA_AFF_CODES_OPTION, []);
    return is_array($codes) ? $codes : [];
}

function kova_aff_save_codes($codes) {
    update_option(KOVA_AFF_CODES_OPTION, $codes, false);
}

function kova_aff_code_get($code) {
    $codes = kova_aff_codes();
    $key   = strtoupper(trim((string) $code));
    return isset($codes[$key]) ? $codes[$key] + ['code' => $key] : null;
}

// Is this user allowed to recruit? Only sponsors are.
function kova_aff_can_recruit($user_id) {
    return $user_id && get_user_meta($user_id, 'kova_aff_can_recruit', true) === 'yes';
}

// Validate a hand-typed code.
function kova_aff_code_validate($code, $current = '') {
    $code = strtoupper(trim($code));

    if ($code === '') {
        return 'Enter a code, or leave it blank to generate one.';
    }
    if (!preg_match('/^[A-Z0-9-]{3,32}$/', $code)) {
        return 'Use 3 to 32 characters: letters, numbers and hyphens only.';
    }
    if (strpos($code, '--') !== false || $code[0] === '-' || substr($code, -1) === '-') {
        return 'Hyphens cannot be doubled, or start or end the code.';
    }
    if ($code === strtoupper($current)) {
        return ''; // unchanged, nothing to check
    }

    $codes = kova_aff_codes();
    if (isset($codes[$code])) {
        return 'That code already exists.';
    }
    if (function_exists('wc_get_coupon_id_by_code') && wc_get_coupon_id_by_code($code)) {
        return 'A WooCommerce coupon with that code already exists.';
    }
    if (kova_aff_user_by_code($code)) {
        return 'That code is already assigned to an affiliate.';
    }
    return '';
}

// Rename a code, everywhere it is recorded.
function kova_aff_code_rename($old, $new) {
    $old   = strtoupper(trim($old));
    $new   = strtoupper(trim($new));
    $codes = kova_aff_codes();

    if (!isset($codes[$old]) || $old === $new) {
        return false;
    }

    $rebuilt = [];
    foreach ($codes as $key => $row) {
        $rebuilt[$key === $old ? $new : $key] = $row;
    }
    kova_aff_save_codes($rebuilt);

    $owner = (int) ($codes[$old]['owner'] ?? 0);
    if ($owner) {
        update_user_meta($owner, 'kova_aff_code', $new);
    }

    if (class_exists('WC_Coupon') && function_exists('wc_get_coupon_id_by_code')) {
        $coupon_id = wc_get_coupon_id_by_code($old);
        if ($coupon_id) {
            $coupon = new WC_Coupon($coupon_id);
            $coupon->set_code($new);
            $coupon->save();
        } elseif ($owner) {
            kova_aff_ensure_coupon($owner);
        }
    }

    if (class_exists('WC_Cache_Helper')) {
        WC_Cache_Helper::invalidate_cache_group('coupons');
    }

    return true;
}

function kova_aff_code_create($owner = 0, $email = '', $custom = '') {
    $codes = kova_aff_codes();

    if ($custom !== '') {
        $code = strtoupper(trim($custom));
        if (kova_aff_code_validate($code) !== '') {
            return '';
        }
    } else {
        do {
            $code = 'KV' . strtoupper(wp_generate_password(6, false, false));
        } while (isset($codes[$code]) || kova_aff_user_by_code($code));
    }

    $codes[$code] = [
        'owner'   => (int) $owner,
        'email'   => sanitize_email($email),
        'created' => current_time('mysql'),
        'claimed' => $owner ? current_time('mysql') : '',
        'revoked' => false,
    ];
    kova_aff_save_codes($codes);

    if ($owner) {
        kova_aff_code_bind($code, (int) $owner);
    }
    return $code;
}

// Attach a code to a user and turn them into a sponsor.
function kova_aff_code_bind($code, $user_id) {
    $code = strtoupper($code);

    update_user_meta($user_id, 'kova_aff_code', $code);
    update_user_meta($user_id, 'kova_aff_can_recruit', 'yes');
    update_user_meta($user_id, 'kova_aff_status', KOVA_AFF_ACTIVE);

    kova_aff_ensure_coupon($user_id);

    $codes = kova_aff_codes();
    if (isset($codes[$code])) {
        $codes[$code]['owner']   = (int) $user_id;
        $codes[$code]['claimed'] = current_time('mysql');
        kova_aff_save_codes($codes);
    }
}

// What a submitted code means for this user.
function kova_aff_code_resolve($code, $user_id) {
    $entry = kova_aff_code_get($code);
    if (!$entry) {
        return ['action' => 'error', 'message' => 'That code is not recognised.'];
    }
    if (!empty($entry['revoked'])) {
        return ['action' => 'error', 'message' => 'That code is no longer active.'];
    }

    // Unclaimed: this person takes ownership.
    if (empty($entry['owner'])) {
        if (!empty($entry['email'])) {
            $user = get_userdata($user_id);
            if (!$user || strcasecmp($user->user_email, $entry['email']) !== 0) {
                // Deliberately vague. Naming the address it is locked to would
                return ['action' => 'error', 'message' => 'That code is registered to a different account.'];
            }
        }
        return ['action' => 'claim', 'code' => $entry['code']];
    }

    // Claimed: this person joins the owner's downline.
    $sponsor = (int) $entry['owner'];
    if ($sponsor === $user_id) {
        return ['action' => 'error', 'message' => 'That is your own code.'];
    }
    if (!kova_aff_can_recruit($sponsor)) {
        return ['action' => 'error', 'message' => 'That code is no longer active.'];
    }
    if (!kova_aff_can_sponsor($sponsor, $user_id)) {
        return ['action' => 'error', 'message' => 'That code cannot be used on this account.'];
    }
    return ['action' => 'recruit', 'code' => $entry['code'], 'sponsor' => $sponsor];
}

// Capture ?sponsor=CODE into a cookie.
add_action('init', function () {
    if (empty($_GET['sponsor']) || is_admin()) {
        return;
    }
    $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', wp_unslash($_GET['sponsor'])));
    if (!$code || headers_sent()) {
        return;
    }
    setcookie(
        KOVA_SPONSOR_COOKIE,
        $code,
        time() + (KOVA_AFF_DAYS * DAY_IN_SECONDS),
        COOKIEPATH ?: '/',
        COOKIE_DOMAIN,
        is_ssl(),
        true
    );
    $_COOKIE[KOVA_SPONSOR_COOKIE] = $code;
});

// The code to pre-fill on the application form, if any.
function kova_aff_pending_sponsor_code() {
    return isset($_COOKIE[KOVA_SPONSOR_COOKIE])
        ? strtoupper(sanitize_text_field(wp_unslash($_COOKIE[KOVA_SPONSOR_COOKIE])))
        : '';
}

function kova_aff_clear_sponsor_cookie() {
    if (headers_sent()) {
        return;
    }
    setcookie(KOVA_SPONSOR_COOKIE, '', time() - 3600, COOKIEPATH ?: '/', COOKIE_DOMAIN, is_ssl(), true);
    unset($_COOKIE[KOVA_SPONSOR_COOKIE]);
}

// The coupon behind each code

function kova_aff_ensure_coupon($user_id) {
    $code = kova_aff_code($user_id);

    $existing = wc_get_coupon_id_by_code($code);
    if ($existing) {
        return $existing;
    }

    $coupon = new WC_Coupon();
    $coupon->set_code($code);
    $coupon->set_discount_type('percent');
    $coupon->set_amount(KOVA_AFF_DISCOUNT);
    $coupon->set_description(sprintf('KOVA affiliate code for user #%d', $user_id));
    $coupon->set_individual_use(false);
    $coupon->save();

    update_post_meta($coupon->get_id(), '_kova_aff_user', $user_id);

    return $coupon->get_id();
}

add_filter('woocommerce_coupon_is_valid', function ($valid, $coupon) {
    if (!$valid) {
        return $valid;
    }
    $owner = (int) get_post_meta($coupon->get_id(), '_kova_aff_user', true);
    if ($owner && $owner === get_current_user_id()) {
        throw new Exception('You cannot use your own affiliate code.');
    }
    return $valid;
}, 10, 2);

add_filter('woocommerce_coupon_is_valid', function ($valid, $coupon) {
    if (!$valid) {
        return $valid;
    }
    $owner = (int) get_post_meta($coupon->get_id(), '_kova_aff_user', true);
    if ($owner && !kova_aff_is_active($owner)) {
        throw new Exception('This code is no longer active.');
    }
    return $valid;
}, 10, 2);

add_action('init', function () {
    if (empty($_GET['aff']) || is_admin()) {
        return;
    }
    $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', wp_unslash($_GET['aff'])));
    if (!$code || headers_sent()) {
        return;
    }
    setcookie(
        KOVA_AFF_COOKIE,
        $code,
        time() + (KOVA_AFF_DAYS * DAY_IN_SECONDS),
        COOKIEPATH ?: '/',
        COOKIE_DOMAIN,
        is_ssl(),
        true
    );
    $_COOKIE[KOVA_AFF_COOKIE] = $code;
});

add_action('woocommerce_before_calculate_totals', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }
    if (!$cart || $cart->is_empty()) {
        return;
    }

    static $applying = false;
    if ($applying) {
        return;
    }

    $code = isset($_COOKIE[KOVA_AFF_COOKIE])
        ? sanitize_text_field(wp_unslash($_COOKIE[KOVA_AFF_COOKIE]))
        : '';
    if (!$code || $cart->has_discount($code)) {
        return;
    }
    $owner = kova_aff_user_by_code($code);
    if ($owner && kova_aff_is_active($owner) && $owner !== get_current_user_id()) {
        $applying = true;
        $cart->apply_coupon($code);
        $applying = false;
    }
});

// Attribution and payout

// Which affiliate, if any, this order belongs to.
function kova_aff_order_affiliate($order) {
    foreach ($order->get_coupon_codes() as $code) {
        $coupon_id = wc_get_coupon_id_by_code($code);
        if (!$coupon_id) {
            continue;
        }
        $owner = (int) get_post_meta($coupon_id, '_kova_aff_user', true);
        if ($owner) {
            return $owner;
        }
    }
    return 0;
}

function kova_aff_net_for($order) {
    $net = (float) $order->get_subtotal() - (float) $order->get_total_discount();
    return max(0, round($net, 2));
}

add_action('woocommerce_order_status_completed', function ($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    if ($order->get_meta('_kova_aff_paid')) {
        return;
    }

    $affiliate = kova_aff_order_affiliate($order);
    if (!$affiliate || !kova_aff_is_active($affiliate)) {
        return;
    }
    // Belt and braces behind the coupon validation guard above.
    if ($affiliate === $order->get_customer_id()) {
        return;
    }

    $net        = kova_aff_net_for($order);
    $commission = round($net * (KOVA_AFF_RATE / 100), 2);
    if ($commission <= 0) {
        return;
    }

    kova_aff_add_balance(
        $affiliate,
        $commission,
        sprintf(
            '%s%% of $%s net on order #%s',
            KOVA_AFF_RATE,
            number_format($net, 2),
            $order->get_order_number()
        ),
        $order_id
    );

    $order->update_meta_data('_kova_aff_paid', 1);
    $order->update_meta_data('_kova_aff_user', $affiliate);
    $order->update_meta_data('_kova_aff_commission', $commission);

    $sponsor = kova_aff_sponsor($affiliate);
    if ($sponsor
        && kova_aff_is_active($sponsor)
        && kova_aff_can_recruit($sponsor)
        && $sponsor !== $affiliate
        && $sponsor !== $order->get_customer_id()) {

        $override = round($net * (KOVA_AFF_OVERRIDE / 100), 2);
        if ($override > 0) {
            $affiliate_user = get_userdata($affiliate);
            kova_aff_add_balance(
                $sponsor,
                $override,
                sprintf(
                    '%s%% override on %s for order #%s',
                    KOVA_AFF_OVERRIDE,
                    $affiliate_user ? $affiliate_user->display_name : 'affiliate #' . $affiliate,
                    $order->get_order_number()
                ),
                $order_id,
                'override'
            );
            $order->update_meta_data('_kova_aff_sponsor', $sponsor);
            $order->update_meta_data('_kova_aff_override', $override);
        }
    }

    $order->save();
});

foreach (['refunded', 'cancelled'] as $kova_aff_bad_status) {
    add_action('woocommerce_order_status_' . $kova_aff_bad_status, function ($order_id) {
        $order = wc_get_order($order_id);
        if (!$order || !$order->get_meta('_kova_aff_paid')) {
            return;
        }
        if ($order->get_meta('_kova_aff_reversed')) {
            return;
        }
        $affiliate  = (int) $order->get_meta('_kova_aff_user');
        $commission = (float) $order->get_meta('_kova_aff_commission');
        if ($affiliate && $commission > 0) {
            kova_aff_add_balance(
                $affiliate,
                -1 * $commission,
                sprintf('Reversed on order #%s (%s)', $order->get_order_number(), $order->get_status()),
                $order_id
            );
        }

        $sponsor  = (int) $order->get_meta('_kova_aff_sponsor');
        $override = (float) $order->get_meta('_kova_aff_override');
        if ($sponsor && $override > 0) {
            kova_aff_add_balance(
                $sponsor,
                -1 * $override,
                sprintf('Override reversed on order #%s (%s)', $order->get_order_number(), $order->get_status()),
                $order_id,
                'override'
            );
        }

        $order->update_meta_data('_kova_aff_reversed', 1);
        $order->save();
    });
}

// The balance ledger

function kova_aff_balance($user_id) {
    return round((float) get_user_meta($user_id, 'kova_aff_balance', true), 2);
}

function kova_aff_lifetime($user_id) {
    return round((float) get_user_meta($user_id, 'kova_aff_lifetime', true), 2);
}

// Earned on their own code.
function kova_aff_lifetime_direct($user_id) {
    return round((float) get_user_meta($user_id, 'kova_aff_lifetime_direct', true), 2);
}

// Earned as override on the people they recruited.
function kova_aff_lifetime_override($user_id) {
    return round((float) get_user_meta($user_id, 'kova_aff_lifetime_override', true), 2);
}

function kova_aff_add_balance($user_id, $amount, $note = '', $order_id = 0, $type = 'commission') {
    $amount = round((float) $amount, 2);

    update_user_meta($user_id, 'kova_aff_balance', round(kova_aff_balance($user_id) + $amount, 2));

    if ($amount !== 0.0) {
        update_user_meta($user_id, 'kova_aff_lifetime', round(kova_aff_lifetime($user_id) + $amount, 2));
    }

    $log = get_user_meta($user_id, 'kova_aff_log', true) ?: [];
    $log[] = [
        'date'     => current_time('mysql'),
        'amount'   => $amount,
        'note'     => $note,
        'order_id' => (int) $order_id,
        'type'     => $type,
    ];
    update_user_meta($user_id, 'kova_aff_log', array_slice($log, -200));

    $key = $type === 'override' ? 'kova_aff_lifetime_override' : 'kova_aff_lifetime_direct';
    update_user_meta($user_id, $key, round((float) get_user_meta($user_id, $key, true) + $amount, 2));
}

function kova_aff_record_payout($user_id, $note = '') {
    $balance = kova_aff_balance($user_id);
    if ($balance == 0.0) {
        return 0.0;
    }

    update_user_meta($user_id, 'kova_aff_balance', 0);

    $log = get_user_meta($user_id, 'kova_aff_log', true) ?: [];
    $log[] = [
        'date'     => current_time('mysql'),
        'amount'   => -1 * $balance,
        'note'     => $note ?: sprintf('Paid out $%s offline', number_format($balance, 2)),
        'order_id' => 0,
        'payout'   => true,
    ];
    update_user_meta($user_id, 'kova_aff_log', array_slice($log, -200));

    $payouts = get_user_meta($user_id, 'kova_aff_payouts', true) ?: [];
    $payouts[] = [
        'date'   => current_time('mysql'),
        'amount' => $balance,
        'by'     => get_current_user_id(),
    ];
    update_user_meta($user_id, 'kova_aff_payouts', $payouts);

    return $balance;
}

function kova_aff_all() {
    return get_users([
        'meta_key'     => 'kova_aff_status',
        'meta_value'   => '',
        'meta_compare' => '!=',
        'orderby'      => 'display_name',
        'order'        => 'ASC',
    ]);
}

// My Account -> Affiliate

add_action('init', function () {
    add_rewrite_endpoint('affiliate', EP_ROOT | EP_PAGES);
});

add_filter('woocommerce_account_menu_items', function ($items) {
    unset($items['downloads']);

    $user_id = get_current_user_id();
    $status  = kova_aff_status($user_id);

    if (get_option('kova_aff_hide_tab') === 'yes' && $status !== KOVA_AFF_ACTIVE) {
        return $items;
    }

    if ($status === KOVA_AFF_REJECTED) {
        return $items;
    }

    $new = [];
    foreach ($items as $key => $label) {
        $new[$key] = $label;
        if ($key === 'dashboard') {
            $new['affiliate'] = 'Affiliate';
        }
    }
    return $new;
});

add_action('template_redirect', function () {
    if (!function_exists('is_wc_endpoint_url') || !is_wc_endpoint_url('affiliate')) {
        return;
    }
    $user_id = get_current_user_id();
    if (!$user_id) {
        wp_safe_redirect(wc_get_page_permalink('myaccount'));
        exit;
    }
    // Three states may view this URL:
    if (kova_aff_status($user_id) === KOVA_AFF_REJECTED) {
        wp_safe_redirect(wc_get_account_endpoint_url('dashboard'));
        exit;
    }
});

// The application form posts here.
add_action('template_redirect', function () {
    if (empty($_POST['kova_aff_apply']) || !is_user_logged_in()) {
        return;
    }
    if (!isset($_POST['kova_aff_nonce'])
        || !wp_verify_nonce($_POST['kova_aff_nonce'], 'kova_aff_apply')) {
        return;
    }

    $user_id = get_current_user_id();
    if (kova_aff_status($user_id)) {
        return; // already applied
    }

    $submitted = strtoupper(trim(sanitize_text_field(wp_unslash($_POST['kova_aff_code'] ?? ''))));
    $resolved  = $submitted ? kova_aff_code_resolve($submitted, $user_id) : null;

    if ($resolved && $resolved['action'] === 'error') {
        set_transient('kova_aff_code_error_' . $user_id, $resolved['message'], 60);
        wp_safe_redirect(wc_get_account_endpoint_url('affiliate'));
        exit;
    }

    if ($resolved && $resolved['action'] === 'claim') {
        update_user_meta($user_id, 'kova_aff_applied', current_time('mysql'));
        update_user_meta(
            $user_id,
            'kova_aff_note',
            sanitize_textarea_field(wp_unslash($_POST['kova_aff_note'] ?? ''))
        );
        kova_aff_code_bind($resolved['code'], $user_id);
        kova_aff_clear_sponsor_cookie();
        wp_safe_redirect(wc_get_account_endpoint_url('affiliate'));
        exit;
    }

    update_user_meta($user_id, 'kova_aff_status', kova_aff_auto_approve() ? KOVA_AFF_ACTIVE : KOVA_AFF_PENDING);
    update_user_meta($user_id, 'kova_aff_applied', current_time('mysql'));

    $sponsor = 0;
    if ($resolved && $resolved['action'] === 'recruit') {
        $sponsor = (int) $resolved['sponsor'];
    } else {
        $cookie    = kova_aff_pending_sponsor_code();
        $candidate = kova_aff_user_by_code($cookie);
        if ($candidate && kova_aff_can_recruit($candidate) && kova_aff_can_sponsor($candidate, $user_id)) {
            $sponsor = $candidate;
        }
    }
    if ($sponsor) {
        update_user_meta($user_id, 'kova_aff_sponsor', $sponsor);
        kova_aff_clear_sponsor_cookie();
    }
    update_user_meta(
        $user_id,
        'kova_aff_note',
        sanitize_textarea_field(wp_unslash($_POST['kova_aff_note'] ?? ''))
    );

    if (kova_aff_auto_approve()) {
        kova_aff_ensure_coupon($user_id);
    } else {
        $user = get_userdata($user_id);
        wp_mail(
            get_option('woocommerce_email_from_address') ?: get_option('admin_email'),
            '[KOVA] New affiliate application',
            sprintf(
                "%s (%s) has applied to the affiliate programme.\n\nReview: %s",
                $user->display_name,
                $user->user_email,
                admin_url('admin.php?page=kova-affiliates')
            )
        );
    }

    wp_safe_redirect(wc_get_account_endpoint_url('affiliate'));
    exit;
});

// Scoped styling for the affiliate screens.
function kova_aff_styles() {
    static $printed = false;
    if ($printed) {
        return;
    }
    $printed = true;
    ?>
    <style>
        .kova-aff { --kv-ink:#17191a; --kv-soft:#23262a; --kv-muted:#2f3336;
                    --kv-faint:#4a4f52; --kv-line:rgba(23,25,26,.12);
                    --kv-cream:#f6f6f5; --kv-cream2:#f1f1f0; }
        .kova-aff { color: var(--kv-soft); }

        .kova-aff__label {
            display:block; margin:0 0 10px;
            font-size:10px; font-weight:700; letter-spacing:.28em;
            text-transform:uppercase; color:var(--kv-faint);
        }
        .kova-aff h3 {
            margin:0 0 14px; font-size:clamp(1.5rem,3vw,2rem);
            font-weight:500; letter-spacing:-.01em; color:var(--kv-ink);
        }
        .kova-aff p { line-height:1.7; color:var(--kv-muted); }
        .kova-aff__lede { font-size:15px; max-width:60ch; }
        .kova-aff__note { font-size:13px; color:var(--kv-faint); max-width:65ch; }

        /* Panels */
        .kova-aff__panel {
            border:1px solid var(--kv-line); background:var(--kv-cream);
            border-radius:12px; padding:26px 28px; margin:0 0 22px;
        }

        /* The code itself — the one thing an affiliate comes here for. */
        .kova-aff__code {
            display:flex; flex-wrap:wrap; align-items:center; gap:14px;
            margin:0 0 6px;
        }
        .kova-aff__code strong {
            font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
            font-size:26px; letter-spacing:.16em; color:var(--kv-ink);
            background:var(--kv-cream2); border:1px solid var(--kv-line);
            border-radius:8px; padding:10px 18px; line-height:1;
        }
        .kova-aff__share {
            display:block; width:100%; margin-top:10px; padding:12px 14px;
            font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
            font-size:12px; color:var(--kv-soft); word-break:break-all;
            background:var(--kv-cream2); border:1px solid var(--kv-line);
            border-radius:8px;
        }

        /* Stat tiles */
        .kova-aff__grid {
            display:grid; gap:14px; margin:0 0 22px;
            grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
        }
        .kova-aff__stat {
            border:1px solid var(--kv-line); background:var(--kv-cream);
            border-radius:12px; padding:20px 22px;
        }
        .kova-aff__stat span {
            display:block; font-size:10px; font-weight:700; letter-spacing:.18em;
            text-transform:uppercase; color:var(--kv-faint);
        }
        .kova-aff__stat strong {
            display:block; margin-top:10px; font-size:30px; font-weight:600;
            letter-spacing:-.02em; color:var(--kv-ink); line-height:1;
        }

        /* Form */
        .kova-aff__input {
            width:100%; max-width:340px; padding:13px 16px;
            font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
            font-size:15px; letter-spacing:.12em; text-transform:uppercase;
            color:var(--kv-ink); background:#fff;
            border:1px solid rgba(23,25,26,.2); border-radius:8px;
        }
        .kova-aff__input:focus {
            outline:none; border-color:var(--kv-faint);
            box-shadow:0 0 0 3px rgba(74,79,82,.12);
        }
        .kova-aff__error {
            margin:8px 0 22px; font-size:13px; font-weight:600; color:#b32d2e;
        }
        .kova-aff textarea {
            width:100%; padding:14px 16px; font-size:14px; line-height:1.6;
            color:var(--kv-ink); background:#fff;
            border:1px solid rgba(23,25,26,.2); border-radius:8px;
            resize:vertical; min-height:130px;
        }
        .kova-aff textarea:focus {
            outline:none; border-color:var(--kv-faint);
            box-shadow:0 0 0 3px rgba(74,79,82,.12);
        }
        .kova-aff__btn {
            display:inline-flex; align-items:center; gap:10px; margin-top:18px;
            padding:14px 30px; border:0; border-radius:999px; cursor:pointer;
            font-size:11px; font-weight:600; letter-spacing:.16em;
            text-transform:uppercase; color:#f6f6f5;
            background:linear-gradient(90deg,#484848 0%,#202020 52%,#060606 100%);
            box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 12px 28px -12px rgba(0,0,0,.55);
            transition:transform .25s ease;
        }
        .kova-aff__btn:hover { transform:scale(1.03); color:#fff; }

        /* History */
        .kova-aff table { width:100%; border-collapse:collapse; margin-top:10px; }
        .kova-aff th {
            text-align:left; padding:0 14px 10px 0;
            font-size:10px; font-weight:700; letter-spacing:.16em;
            text-transform:uppercase; color:var(--kv-faint);
            border-bottom:1px solid var(--kv-line);
        }
        .kova-aff td {
            padding:14px 14px 14px 0; font-size:13.5px; color:var(--kv-soft);
            border-bottom:1px solid var(--kv-line); vertical-align:top;
        }
        .kova-aff td:last-child, .kova-aff th:last-child {
            text-align:right; padding-right:0; white-space:nowrap;
        }
        .kova-aff__amt-pos { color:var(--kv-ink); font-weight:600; }
        .kova-aff__amt-neg { color:var(--kv-faint); }
        .kova-aff__empty { color:var(--kv-faint); font-style:italic; }

        /* Pending state */
        .kova-aff__pending {
            border:1px solid var(--kv-line); background:var(--kv-cream);
            border-radius:12px; padding:34px 30px; text-align:center;
        }
    </style>
    <?php
}

add_action('woocommerce_account_affiliate_endpoint', function () {
    $user_id = get_current_user_id();

    // Auto-claim an email-locked invite.
    if (!kova_aff_status($user_id)) {
        $pending = kova_aff_pending_sponsor_code();
        if ($pending) {
            $entry    = kova_aff_code_get($pending);
            $resolved = kova_aff_code_resolve($pending, $user_id);
            if ($entry && !empty($entry['email'])
                && $resolved['action'] === 'claim') {
                update_user_meta($user_id, 'kova_aff_applied', current_time('mysql'));
                kova_aff_code_bind($resolved['code'], $user_id);
                kova_aff_clear_sponsor_cookie();
            }
        }
    }

    $status = kova_aff_status($user_id);

    kova_aff_styles();
    echo '<div class="kova-aff">';

    if ($status === KOVA_AFF_PENDING) {
        ?>
        <div class="kova-aff__pending">
            <span class="kova-aff__label">Application received</span>
            <h3>We have your application</h3>
            <p class="kova-aff__lede" style="margin:0 auto;">
                It is with the KOVA team for review. You will get an email once
                it has been looked at, and your code and earnings will appear
                here as soon as it is approved.
            </p>
        </div>
        </div>
        <?php
        return;
    }

    if (!$status) {
        ?>
        <span class="kova-aff__label">Affiliate Programme</span>
        <h3>Earn on every order you send us</h3>
        <p class="kova-aff__lede">
            Approved affiliates get a private code. Anyone who uses it takes
            <strong><?php echo KOVA_AFF_DISCOUNT; ?>%</strong> off their order,
            and you earn <strong><?php echo KOVA_AFF_RATE; ?>%</strong> of what
            they pay after that discount.
        </p>

        <div class="kova-aff__grid">
            <div class="kova-aff__stat">
                <span>They save</span>
                <strong><?php echo KOVA_AFF_DISCOUNT; ?>%</strong>
            </div>
            <div class="kova-aff__stat">
                <span>You earn</span>
                <strong><?php echo KOVA_AFF_RATE; ?>%</strong>
            </div>
            <div class="kova-aff__stat">
                <span>On your recruits</span>
                <strong><?php echo KOVA_AFF_OVERRIDE; ?>%</strong>
            </div>
        </div>

        <?php
        $prefill = kova_aff_pending_sponsor_code();
        $code_error = get_transient('kova_aff_code_error_' . $user_id);
        if ($code_error) {
            delete_transient('kova_aff_code_error_' . $user_id);
        }
        ?>
        <div class="kova-aff__panel">
            <form method="post">
                <?php wp_nonce_field('kova_aff_apply', 'kova_aff_nonce'); ?>

                <label class="kova-aff__label" for="kova_aff_code">
                    Sponsor code (optional)
                </label>
                <input type="text" id="kova_aff_code" name="kova_aff_code"
                       class="kova-aff__input" autocomplete="off"
                       placeholder="e.g. KVA1B2C3"
                       value="<?php echo esc_attr($prefill); ?>">
                <?php
                // Resolve the prefilled code so the form can say what will
                $preview = $prefill ? kova_aff_code_resolve($prefill, $user_id) : null;
                ?>
                <?php if ($code_error) : ?>
                    <p class="kova-aff__error"><?php echo esc_html($code_error); ?></p>
                <?php elseif ($preview && $preview['action'] === 'claim') : ?>
                    <p class="kova-aff__note" style="margin:8px 0 22px;">
                        <strong>You have been invited as a sponsor.</strong>
                        Submitting this form activates
                        <code><?php echo esc_html($prefill); ?></code> as your code
                        and approves you straight away, so there is no wait.
                    </p>
                <?php elseif ($preview && $preview['action'] === 'recruit') : ?>
                    <p class="kova-aff__note" style="margin:8px 0 22px;">
                        You were invited by an existing sponsor. Submitting this
                        form joins their team. Applications are reviewed by hand.
                    </p>
                <?php elseif ($preview && $preview['action'] === 'error') : ?>
                    <p class="kova-aff__error"><?php echo esc_html($preview['message']); ?></p>
                <?php else : ?>
                    <p class="kova-aff__note" style="margin:8px 0 22px;">
                        If someone invited you, enter the code they gave you.
                        Leave it blank if you came here on your own.
                    </p>
                <?php endif; ?>

                <label class="kova-aff__label" for="kova_aff_note">
                    How do you plan to share your code? (optional)
                </label>
                <textarea id="kova_aff_note" name="kova_aff_note" rows="5"
                          placeholder="A short note helps us review it faster."></textarea>
                <button type="submit" name="kova_aff_apply" value="1" class="kova-aff__btn">
                    Apply to join
                </button>
            </form>
        </div>

        <p class="kova-aff__note">
            Commission is credited once an order is completed and paid out by
            the KOVA team directly, not as store credit. Applications are
            reviewed by hand, so this is not instant.
        </p>
        </div>
        <?php
        return;
    }

    if ($status !== KOVA_AFF_ACTIVE) {
        echo '</div>';
        return; // template_redirect has already handled these
    }

    $code     = kova_aff_code($user_id);
    $balance  = kova_aff_balance($user_id);
    $lifetime = kova_aff_lifetime($user_id);
    $override = kova_aff_lifetime_override($user_id);
    $log      = array_reverse(get_user_meta($user_id, 'kova_aff_log', true) ?: []);
    kova_aff_ensure_coupon($user_id);

    $share       = add_query_arg('aff', $code, home_url('/'));
    $can_recruit = kova_aff_can_recruit($user_id);
    $downline = get_users([
        'meta_key'   => 'kova_aff_sponsor',
        'meta_value' => $user_id,
        'fields'     => 'ID',
    ]);
    ?>
    <span class="kova-aff__label">Your affiliate code</span>
    <div class="kova-aff__panel">
        <div class="kova-aff__code">
            <strong><?php echo esc_html($code); ?></strong>
        </div>
        <p class="kova-aff__note" style="margin:14px 0 0;">
            This code is yours alone. Anyone who uses it gets
            <?php echo KOVA_AFF_DISCOUNT; ?>% off, and you earn
            <?php echo KOVA_AFF_RATE; ?>% of what they pay after that discount.
            It cannot be used on your own orders.
        </p>
        <span class="kova-aff__label" style="margin:22px 0 8px;">Or share this link</span>
        <code class="kova-aff__share"><?php echo esc_url($share); ?></code>
        <p class="kova-aff__note" style="margin:10px 0 0;">
            The code applies itself at checkout, so nobody has to type it.
        </p>
    </div>

    <div class="kova-aff__grid">
        <div class="kova-aff__stat">
            <span>Unpaid balance</span>
            <strong>$<?php echo number_format($balance, 2); ?></strong>
        </div>
        <div class="kova-aff__stat">
            <span>Earned to date</span>
            <strong>$<?php echo number_format($lifetime, 2); ?></strong>
        </div>
        <?php if ($can_recruit) : ?>
        <div class="kova-aff__stat">
            <span>Override earned</span>
            <strong>$<?php echo number_format($override, 2); ?></strong>
        </div>
        <div class="kova-aff__stat">
            <span>Affiliates recruited</span>
            <strong><?php echo count($downline); ?></strong>
        </div>
        <?php endif; ?>
    </div>

    <?php if ($can_recruit) : ?>
        <div class="kova-aff__panel">
            <span class="kova-aff__label">Building your team</span>
            <p class="kova-aff__note" style="margin:0 0 16px;">
                Your code does two jobs. Customers use it at checkout for
                <?php echo KOVA_AFF_DISCOUNT; ?>% off. Anyone joining the
                affiliate programme can enter it on their application to join
                your team, and you then earn
                <strong><?php echo KOVA_AFF_OVERRIDE; ?>%</strong> of every sale
                they make, on top of their own <?php echo KOVA_AFF_RATE; ?>%. It
                costs them nothing.
            </p>
            <span class="kova-aff__label" style="margin:0 0 8px;">Invite link</span>
            <code class="kova-aff__share"><?php
                echo esc_url(add_query_arg('sponsor', $code, wc_get_account_endpoint_url('affiliate')));
            ?></code>
            <p class="kova-aff__note" style="margin:10px 0 0;">
                Send this to someone you want on your team. It fills the code in
                for them, and it survives them creating an account first.
            </p>
        </div>
    <?php endif; ?>

    <div class="kova-aff__panel">
        <span class="kova-aff__label">How payouts work</span>
        <p class="kova-aff__note" style="margin:0;">
            Commission is credited when an order reaches <strong>Completed</strong>,
            and reversed if it is later refunded. Balances are paid out by the
            KOVA team outside the store. Once a payment has been sent your
            unpaid balance resets to zero and the payout appears in the history
            below.
        </p>
    </div>

    <span class="kova-aff__label">History</span>
    <table>
        <thead>
            <tr><th>Date</th><th>Detail</th><th>Amount</th></tr>
        </thead>
        <tbody>
        <?php if (!$log) : ?>
            <tr><td colspan="3" class="kova-aff__empty">Nothing yet. Share your code to get started.</td></tr>
        <?php endif; ?>
        <?php foreach (array_slice($log, 0, 50) as $row) : ?>
            <tr>
                <td><?php echo esc_html(date_i18n('M j, Y', strtotime($row['date']))); ?></td>
                <td><?php echo esc_html($row['note']); ?></td>
                <td class="<?php echo $row['amount'] < 0 ? 'kova-aff__amt-neg' : 'kova-aff__amt-pos'; ?>">
                    <?php echo $row['amount'] < 0 ? '-' : ''; ?>$<?php echo number_format(abs($row['amount']), 2); ?>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    </div>
    <?php
});

// Admin redirects on a split-origin install

add_filter('allowed_redirect_hosts', function ($hosts) {
    foreach ([site_url(), home_url()] as $url) {
        $host = wp_parse_url($url, PHP_URL_HOST);
        if ($host && !in_array($host, (array) $hosts, true)) {
            $hosts[] = $host;
        }
    }
    return $hosts;
});

// Admin

add_action('admin_menu', function () {
    add_submenu_page(
        'woocommerce',
        'KOVA Affiliates',
        'KOVA Affiliates',
        'manage_woocommerce',
        'kova-affiliates',
        'kova_affiliates_admin_page'
    );
});

add_action('admin_init', function () {
    register_setting('kova_affiliates', 'kova_aff_auto_approve');
    register_setting('kova_affiliates', 'kova_aff_hide_tab');
});

add_action('admin_post_kova_aff_action', function () {
    if (!current_user_can('manage_woocommerce')) {
        wp_die('Not allowed.');
    }
    $user_id = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
    $action  = sanitize_text_field(wp_unslash($_POST['kova_action'] ?? ''));

    check_admin_referer('kova_aff_' . $action . '_' . $user_id);

    if (!$user_id || !get_userdata($user_id)) {
        wp_die('Unknown user.');
    }

    $notice = '';
    switch ($action) {
        case 'approve':
            update_user_meta($user_id, 'kova_aff_status', KOVA_AFF_ACTIVE);
            kova_aff_ensure_coupon($user_id);
            $notice = 'approved';
            break;

        case 'reject':
            update_user_meta($user_id, 'kova_aff_status', KOVA_AFF_REJECTED);
            $notice = 'rejected';
            break;

        case 'reset':
            $paid   = kova_aff_record_payout($user_id);
            $notice = 'reset&amount=' . rawurlencode(number_format($paid, 2));
            break;
    }

    wp_safe_redirect(admin_url('admin.php?page=kova-affiliates&kova_notice=' . $notice));
    exit;
});

function kova_affiliates_admin_page() {
    $affiliates = kova_aff_all();
    $notice     = isset($_GET['kova_notice']) ? sanitize_text_field(wp_unslash($_GET['kova_notice'])) : '';
    ?>
    <div class="wrap">
        <h1>KOVA Affiliates</h1>

        <?php if ($notice === 'approved') : ?>
            <div class="notice notice-success is-dismissible"><p>Affiliate approved. Their code is live.</p></div>
        <?php elseif ($notice === 'rejected') : ?>
            <div class="notice notice-warning is-dismissible"><p>Application rejected. Their code no longer works.</p></div>
        <?php elseif ($notice === 'code_created') : ?>
            <div class="notice notice-success is-dismissible"><p>Sponsor code created. Copy its invite link from the table below.</p></div>
        <?php elseif ($notice === 'code_revoked') : ?>
            <div class="notice notice-warning is-dismissible"><p>Code revoked. Existing team links and earnings are unchanged.</p></div>
        <?php elseif ($notice === 'code_restored') : ?>
            <div class="notice notice-success is-dismissible"><p>Code restored.</p></div>
        <?php elseif ($notice === 'code_renamed') : ?>
            <div class="notice notice-success is-dismissible">
                <p>Code renamed. The coupon and the owner's affiliate code were updated to match.
                   <strong>Anywhere the old code was already shared, it has stopped working.</strong></p>
            </div>
        <?php elseif ($notice === 'code_error') : ?>
            <div class="notice notice-error is-dismissible">
                <p><?php
                    $msg = get_transient('kova_aff_code_notice');
                    delete_transient('kova_aff_code_notice');
                    echo esc_html($msg ?: 'That code could not be saved.');
                ?></p>
            </div>
        <?php elseif ($notice === 'code_deleted') : ?>
            <div class="notice notice-success is-dismissible"><p>Unclaimed code deleted.</p></div>
        <?php elseif ($notice === 'reset') : ?>
            <div class="notice notice-success is-dismissible">
                <p>Balance reset. Recorded a payout of
                   <strong>$<?php echo esc_html($_GET['amount'] ?? '0.00'); ?></strong>.</p>
            </div>
        <?php endif; ?>

        <p>
            Buyer discount <strong><?php echo KOVA_AFF_DISCOUNT; ?>%</strong>
            · Commission <strong><?php echo KOVA_AFF_RATE; ?>%</strong> of the discounted goods total
            · Override <strong><?php echo KOVA_AFF_OVERRIDE; ?>%</strong> to the recruiter
            · Affiliates <strong><?php echo count($affiliates); ?></strong>
        </p>
        <p class="description">
            Commission is credited when an order reaches <strong>Completed</strong> and
            reversed if it is later refunded or cancelled. Shipping and tax are
            excluded. Payouts happen outside the store. Use <strong>Reset balance</strong>
            once you have paid someone, which zeroes what they are owed and files it
            in their history. Lifetime earnings are never reset.
        </p>

        <form method="post" action="options.php" style="margin:18px 0;">
            <?php settings_fields('kova_affiliates'); ?>
            <label>
                <input type="checkbox" name="kova_aff_auto_approve" value="yes"
                    <?php checked(get_option('kova_aff_auto_approve'), 'yes'); ?>>
                Approve applications automatically
            </label>
            <br>
            <label style="display:inline-block;margin-top:8px;">
                <input type="checkbox" name="kova_aff_hide_tab" value="yes"
                    <?php checked(get_option('kova_aff_hide_tab'), 'yes'); ?>>
                Hide the Affiliate tab from My Account
            </label>
            <p class="description" style="margin:6px 0 10px;">
                Tick this to run the programme invite-only: the tab disappears
                and the only way in is the direct link
                <code><?php echo esc_html(wc_get_account_endpoint_url('affiliate')); ?></code>.
                Anyone already approved keeps their tab.
            </p>
            <p class="description" style="margin:6px 0 10px;">
                Off by default. An affiliate code is a standing
                <?php echo KOVA_AFF_DISCOUNT; ?>% discount on the whole catalog, so
                self-service signup means anyone can mint one.
            </p>
            <?php submit_button('Save', 'secondary', 'submit', false); ?>
        </form>

        <table class="widefat striped">
            <thead>
                <tr>
                    <th>Affiliate</th>
                    <th>Status</th>
                    <th>Code</th>
                    <th>Sponsor</th>
                    <th>Unpaid balance</th>
                    <th>Earned to date</th>
                    <th>Last payout</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php if (!$affiliates) : ?>
                <tr><td colspan="8">Nobody has applied yet.</td></tr>
            <?php endif; ?>
            <?php foreach ($affiliates as $user) :
                $status   = kova_aff_status($user->ID);
                $balance  = kova_aff_balance($user->ID);
                $payouts  = get_user_meta($user->ID, 'kova_aff_payouts', true) ?: [];
                $last     = $payouts ? end($payouts) : null;
                ?>
                <tr>
                    <td>
                        <strong><?php echo esc_html($user->display_name); ?></strong><br>
                        <a href="mailto:<?php echo esc_attr($user->user_email); ?>">
                            <?php echo esc_html($user->user_email); ?>
                        </a>
                    </td>
                    <td><?php echo esc_html(ucfirst($status)); ?></td>
                    <td>
                        <?php echo $status === KOVA_AFF_ACTIVE
                            ? '<code>' . esc_html(kova_aff_code($user->ID)) . '</code>'
                            : 'None'; ?>
                    </td>
                    <td>
                        <?php
                        $sponsor_id = kova_aff_sponsor($user->ID);
                        $sponsor    = $sponsor_id ? get_userdata($sponsor_id) : null;
                        echo $sponsor ? esc_html($sponsor->display_name) : 'None';
                        ?>
                    </td>
                    <td><strong>$<?php echo number_format($balance, 2); ?></strong></td>
                    <td>
                        $<?php echo number_format(kova_aff_lifetime($user->ID), 2); ?>
                        <br><span class="description">
                            $<?php echo number_format(kova_aff_lifetime_direct($user->ID), 2); ?> own
                            · $<?php echo number_format(kova_aff_lifetime_override($user->ID), 2); ?> override
                        </span>
                    </td>
                    <td>
                        <?php if ($last) : ?>
                            $<?php echo number_format($last['amount'], 2); ?><br>
                            <span class="description">
                                <?php echo esc_html(date_i18n('M j, Y', strtotime($last['date']))); ?>
                            </span>
                        <?php else : ?>
                            None
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if ($status === KOVA_AFF_PENDING) : ?>
                            <?php kova_aff_action_button($user->ID, 'approve', 'Approve', 'button-primary'); ?>
                            <?php kova_aff_action_button($user->ID, 'reject', 'Reject'); ?>
                        <?php elseif ($status === KOVA_AFF_ACTIVE) : ?>
                            <?php kova_aff_action_button(
                                $user->ID,
                                'reset',
                                'Reset balance',
                                'button-primary',
                                sprintf(
                                    'Record a payout of $%s to %s and reset their balance to zero?',
                                    number_format($balance, 2),
                                    $user->display_name
                                ),
                                $balance == 0.0
                            ); ?>
                            <?php kova_aff_action_button($user->ID, 'reject', 'Suspend'); ?>
                        <?php else : ?>
                            <?php kova_aff_action_button($user->ID, 'approve', 'Reinstate'); ?>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>

        <?php kova_aff_render_codes_panel(); ?>
    </div>
    <?php
}

function kova_aff_action_button($user_id, $action, $label, $class = 'button', $confirm = '', $disabled = false) {
    ?>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
          <?php // vertical-align:middle — each action is its own form, and
                // inline-block forms align on their text baseline by default,
          style="display:inline-block;vertical-align:middle;margin:0 4px 4px 0;"
          <?php if ($confirm) : ?>
              onsubmit="return confirm('<?php echo esc_js($confirm); ?>');"
          <?php endif; ?>>
        <input type="hidden" name="action" value="kova_aff_action">
        <input type="hidden" name="kova_action" value="<?php echo esc_attr($action); ?>">
        <input type="hidden" name="user_id" value="<?php echo (int) $user_id; ?>">
        <?php wp_nonce_field('kova_aff_' . $action . '_' . $user_id); ?>
        <button type="submit" class="<?php echo esc_attr($class); ?>"
            <?php disabled($disabled); ?>><?php echo esc_html($label); ?></button>
    </form>
    <?php
}

// Sponsor code admin actions

add_action('admin_post_kova_aff_code', function () {
    if (!current_user_can('manage_woocommerce')) {
        wp_die('Not allowed.');
    }
    $action = sanitize_text_field(wp_unslash($_POST['kova_code_action'] ?? ''));
    check_admin_referer('kova_aff_code_' . $action);

    $notice = '';
    switch ($action) {
        case 'create':
            $owner  = isset($_POST['owner']) ? (int) $_POST['owner'] : 0;
            $email  = sanitize_email(wp_unslash($_POST['email'] ?? ''));
            $custom = strtoupper(trim(sanitize_text_field(wp_unslash($_POST['code'] ?? ''))));
            if ($owner && !get_userdata($owner)) {
                $owner = 0;
            }
            if ($custom !== '') {
                $error = kova_aff_code_validate($custom);
                if ($error !== '') {
                    set_transient('kova_aff_code_notice', $error, 60);
                    $notice = 'code_error';
                    break;
                }
            }
            kova_aff_code_create($owner, $email, $custom);
            $notice = 'code_created';
            break;

        case 'rename':
            $old_code = strtoupper(sanitize_text_field(wp_unslash($_POST['code'] ?? '')));
            $new_code = strtoupper(trim(sanitize_text_field(wp_unslash($_POST['new_code'] ?? ''))));
            $error    = kova_aff_code_validate($new_code, $old_code);
            if ($error !== '') {
                set_transient('kova_aff_code_notice', $error, 60);
                $notice = 'code_error';
                break;
            }
            $notice = kova_aff_code_rename($old_code, $new_code) ? 'code_renamed' : 'code_error';
            break;

        case 'revoke':
        case 'restore':
            $code  = strtoupper(sanitize_text_field(wp_unslash($_POST['code'] ?? '')));
            $codes = kova_aff_codes();
            if (isset($codes[$code])) {
                $codes[$code]['revoked'] = ($action === 'revoke');
                kova_aff_save_codes($codes);

                // Revoking also removes the owner's ability to recruit. Their
                if (!empty($codes[$code]['owner'])) {
                    update_user_meta(
                        (int) $codes[$code]['owner'],
                        'kova_aff_can_recruit',
                        $action === 'revoke' ? 'no' : 'yes'
                    );
                }
            }
            $notice = $action === 'revoke' ? 'code_revoked' : 'code_restored';
            break;

        case 'delete':
            $code  = strtoupper(sanitize_text_field(wp_unslash($_POST['code'] ?? '')));
            $codes = kova_aff_codes();
            if (isset($codes[$code]) && empty($codes[$code]['owner'])) {
                unset($codes[$code]);
                kova_aff_save_codes($codes);
                $notice = 'code_deleted';
            }
            break;
    }

    wp_safe_redirect(admin_url('admin.php?page=kova-affiliates&kova_notice=' . $notice));
    exit;
});

// The sponsor code table and its create form.
function kova_aff_render_codes_panel() {
    $codes = kova_aff_codes();
    // Newest first — the one just created is the one being copied.
    uasort($codes, function ($a, $b) {
        return strcmp($b['created'] ?? '', $a['created'] ?? '');
    });

    $customers = get_users([
        'number'  => 200,
        'orderby' => 'display_name',
        'order'   => 'ASC',
        'fields'  => ['ID', 'display_name', 'user_email'],
    ]);
    ?>
    <h2 style="margin-top:34px;">Sponsor codes</h2>
    <p class="description" style="max-width:760px;">
        A sponsor code is a normal affiliate code with recruiting rights. Customers
        use it at checkout for <?php echo KOVA_AFF_DISCOUNT; ?>% off and the owner
        earns <?php echo KOVA_AFF_RATE; ?>%, exactly like any other code. What makes
        it a sponsor code is that people joining the affiliate programme can enter
        it on their application to join that person's team, and the owner then earns
        <?php echo KOVA_AFF_OVERRIDE; ?>% of everything those recruits sell.
    </p>
    <p class="description" style="max-width:760px;">
        Leave <strong>Assign to</strong> empty to issue a code to someone who does
        not have an account yet. They open the invite link, register if they need
        to, and the code claims when they <strong>submit the application form</strong>,
        not when they register. Whoever submits first becomes the owner and
        is approved automatically. Lock it to an email address if you want only that
        person to be able to claim it.
    </p>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
          style="margin:16px 0 24px;padding:16px;border:1px solid #ccd0d4;background:#fff;max-width:760px;">
        <input type="hidden" name="action" value="kova_aff_code">
        <input type="hidden" name="kova_code_action" value="create">
        <?php wp_nonce_field('kova_aff_code_create'); ?>
        <table class="form-table" style="margin:0;">
            <tr>
                <th scope="row" style="width:150px;"><label for="kova_code_custom">Code</label></th>
                <td>
                    <input type="text" name="code" id="kova_code_custom" class="regular-text"
                           placeholder="leave blank to generate one"
                           style="text-transform:uppercase;font-family:monospace;letter-spacing:.08em;">
                    <p class="description">
                        Letters, numbers and hyphens, 3 to 32 characters. This is what a
                        customer types at checkout and what a recruit enters on their
                        application, so something sayable out loud works best
                        (e.g. <code>JANE-LAB</code>).
                    </p>
                </td>
            </tr>
            <tr>
                <th scope="row" style="width:150px;"><label for="kova_code_owner">Assign to</label></th>
                <td>
                    <select name="owner" id="kova_code_owner">
                        <option value="">Nobody yet (claimed on signup)</option>
                        <?php foreach ($customers as $c) : ?>
                            <option value="<?php echo esc_attr($c->ID); ?>">
                                <?php echo esc_html($c->display_name . ' (' . $c->user_email . ')'); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="kova_code_email">Lock to email</label></th>
                <td>
                    <input type="email" name="email" id="kova_code_email" class="regular-text"
                           placeholder="optional">
                    <p class="description">
                        Only this address can claim the code. Without it, whoever opens
                        the link first becomes the sponsor.
                    </p>
                </td>
            </tr>
        </table>
        <?php submit_button('Create sponsor code', 'primary', 'submit', false); ?>
    </form>

    <table class="widefat striped" style="max-width:1100px;">
        <thead>
            <tr>
                <th>Code</th>
                <th>Status</th>
                <th>Sponsor</th>
                <th>Locked to</th>
                <th>Recruits</th>
                <th>Invite link</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (!$codes) : ?>
            <tr><td colspan="7">No sponsor codes yet.</td></tr>
        <?php endif; ?>
        <?php foreach ($codes as $code => $row) :
            $owner    = (int) ($row['owner'] ?? 0);
            $user     = $owner ? get_userdata($owner) : null;
            $revoked  = !empty($row['revoked']);
            $recruits = $owner ? count(get_users([
                'meta_key'   => 'kova_aff_sponsor',
                'meta_value' => $owner,
                'fields'     => 'ID',
            ])) : 0;
            $link = add_query_arg('sponsor', $code, wc_get_account_endpoint_url('affiliate'));
            ?>
            <tr>
                <td>
                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
                          style="display:flex;gap:4px;align-items:center;"
                          onsubmit="return confirm('Rename <?php echo esc_js($code); ?>? Anywhere the old code has already been shared it will stop working.');">
                        <input type="hidden" name="action" value="kova_aff_code">
                        <input type="hidden" name="kova_code_action" value="rename">
                        <input type="hidden" name="code" value="<?php echo esc_attr($code); ?>">
                        <?php wp_nonce_field('kova_aff_code_rename'); ?>
                        <input type="text" name="new_code" value="<?php echo esc_attr($code); ?>"
                               style="width:150px;font-family:monospace;letter-spacing:.06em;text-transform:uppercase;">
                        <button type="submit" class="button button-small">Save</button>
                    </form>
                </td>
                <td>
                    <?php if ($revoked) : ?>
                        <span style="color:#b32d2e">Revoked</span>
                    <?php elseif ($owner) : ?>
                        <span style="color:#007017">Claimed</span>
                    <?php else : ?>
                        Unclaimed
                    <?php endif; ?>
                </td>
                <td><?php echo $user ? esc_html($user->display_name) : 'None'; ?></td>
                <td><?php echo !empty($row['email']) ? esc_html($row['email']) : 'None'; ?></td>
                <td><?php echo $owner ? (int) $recruits : 'None'; ?></td>
                <td>
                    <input type="text" readonly value="<?php echo esc_attr($link); ?>"
                           onclick="this.select();" style="width:100%;max-width:330px;font-size:11px;">
                </td>
                <td>
                    <?php if ($revoked) : ?>
                        <?php kova_aff_code_button($code, 'restore', 'Restore'); ?>
                    <?php elseif ($owner) : ?>
                        <?php kova_aff_code_button(
                            $code,
                            'revoke',
                            'Revoke',
                            'Revoke this code? It stops working at checkout and the owner can no longer recruit. Existing team links and earnings are kept.'
                        ); ?>
                    <?php else : ?>
                        <?php kova_aff_code_button($code, 'delete', 'Delete', 'Delete this unclaimed code?'); ?>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    <?php
}

function kova_aff_code_button($code, $action, $label, $confirm = '') {
    ?>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
          style="display:inline-block;margin:0 4px 4px 0;"
          <?php if ($confirm) : ?>onsubmit="return confirm('<?php echo esc_js($confirm); ?>');"<?php endif; ?>>
        <input type="hidden" name="action" value="kova_aff_code">
        <input type="hidden" name="kova_code_action" value="<?php echo esc_attr($action); ?>">
        <input type="hidden" name="code" value="<?php echo esc_attr($code); ?>">
        <?php wp_nonce_field('kova_aff_code_' . $action); ?>
        <button type="submit" class="button"><?php echo esc_html($label); ?></button>
    </form>
    <?php
}

add_filter('manage_users_columns', function ($columns) {
    $columns['kova_aff'] = 'Affiliate';
    return $columns;
});

add_filter('manage_users_custom_column', function ($output, $column, $user_id) {
    if ($column !== 'kova_aff') {
        return $output;
    }
    $status = kova_aff_status($user_id);
    if (!$status) {
        return 'None';
    }
    if ($status !== KOVA_AFF_ACTIVE) {
        return esc_html(ucfirst($status));
    }
    return sprintf(
        '%s<br><span class="description">$%s unpaid</span>',
        esc_html(kova_aff_code($user_id)),
        number_format(kova_aff_balance($user_id), 2)
    );
}, 10, 3);

// Order screen — who earned on this order and how much.

add_action('woocommerce_admin_order_data_after_order_details', function ($order) {
    $affiliate = (int) $order->get_meta('_kova_aff_user');
    if (!$affiliate) {
        return;
    }
    $user = get_userdata($affiliate);
    printf(
        '<p class="form-field form-field-wide"><strong>KOVA affiliate:</strong> %s, commission $%s%s</p>',
        $user ? esc_html($user->display_name) : 'user #' . $affiliate,
        number_format((float) $order->get_meta('_kova_aff_commission'), 2),
        $order->get_meta('_kova_aff_reversed') ? ' <em>(reversed)</em>' : ''
    );
});

// Rewrites, so /my-account/affiliate/ resolves on activation.

register_activation_hook(__FILE__, function () {
    add_rewrite_endpoint('affiliate', EP_ROOT | EP_PAGES);
    flush_rewrite_rules();
});
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
