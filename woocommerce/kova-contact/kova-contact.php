<?php
/**
 * Plugin Name: KOVA Forms
 * Description: Receives the storefront's contact and wholesale forms. Stores every submission in wp-admin so nothing is lost if email fails, and sends the notification through wp_mail() — which means WP Mail SMTP, or whichever mailer the store already uses for WooCommerce order emails, delivers it. No third-party form service.
 * Version: 1.0.0
 * Author: ShehabDev
 */

if (!defined('ABSPATH')) {
    exit;
}

const KOVA_MESSAGE_CPT = 'kova_message';

function kova_forms_secret() {
    return (string) get_option('kova_bridge_secret', '');
}

// Stored submissions

add_action('init', function () {
    register_post_type(KOVA_MESSAGE_CPT, [
        'labels' => [
            'name'          => 'Form Messages',
            'singular_name' => 'Message',
            'edit_item'     => 'Message',
            'search_items'  => 'Search messages',
            'not_found'     => 'No messages yet.',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-email-alt',
        'menu_position' => 26,
        'supports'     => ['title', 'editor'],
        'has_archive'  => false,
        'rewrite'      => false,
        'capabilities' => [
            'create_posts' => 'do_not_allow',
        ],
        'map_meta_cap' => true,
    ]);
});

add_filter('manage_' . KOVA_MESSAGE_CPT . '_posts_columns', function () {
    return [
        'cb'        => '<input type="checkbox" />',
        'title'     => 'From',
        'kova_type' => 'Form',
        'kova_mail' => 'Email',
        'kova_subj' => 'Subject',
        'date'      => 'Received',
    ];
});

add_action('manage_' . KOVA_MESSAGE_CPT . '_posts_custom_column', function ($column, $post_id) {
    switch ($column) {
        case 'kova_type':
            $type = get_post_meta($post_id, 'kova_form_type', true);
            echo esc_html($type === 'wholesale' ? 'Wholesale' : 'Contact');
            break;
        case 'kova_mail':
            $email = get_post_meta($post_id, 'kova_email', true);
            if ($email) {
                printf('<a href="mailto:%1$s">%1$s</a>', esc_attr($email));
            } else {
                echo 'None';
            }
            break;
        case 'kova_subj':
            echo esc_html(get_post_meta($post_id, 'kova_subject', true) ?: 'None');
            break;
    }
}, 10, 2);

add_action('add_meta_boxes', function () {
    add_meta_box(
        'kova_message_details',
        'Submission Details',
        function ($post) {
            $rows = [
                'Form'    => get_post_meta($post->ID, 'kova_form_type', true),
                'Name'    => get_post_meta($post->ID, 'kova_name', true),
                'Email'   => get_post_meta($post->ID, 'kova_email', true),
                'Phone'   => get_post_meta($post->ID, 'kova_phone', true),
                'Subject' => get_post_meta($post->ID, 'kova_subject', true),
            ];
            $extra = get_post_meta($post->ID, 'kova_extra', true);
            if (is_array($extra)) {
                foreach ($extra as $key => $value) {
                    $rows[ucwords(str_replace(['_', '-'], ' ', $key))] =
                        is_scalar($value) ? (string) $value : wp_json_encode($value);
                }
            }
            echo '<table class="widefat striped"><tbody>';
            foreach ($rows as $label => $value) {
                if ($value === '' || $value === null) {
                    continue;
                }
                printf(
                    '<tr><th style="width:180px">%s</th><td>%s</td></tr>',
                    esc_html($label),
                    esc_html($value)
                );
            }
            echo '</tbody></table>';
        },
        KOVA_MESSAGE_CPT,
        'normal',
        'high'
    );
});

// Delivery

function kova_forms_recipient() {
    $woo = get_option('woocommerce_email_from_address');
    $to  = $woo ? $woo : get_option('admin_email');

    return apply_filters('kova_forms_recipient', $to);
}

function kova_forms_send_mail($post_id, $data) {
    $type    = $data['type'] === 'wholesale' ? 'Wholesale enquiry' : 'Contact form';
    $subject = sprintf('[KOVA] %s: %s', $type, $data['subject'] ?: $data['name']);

    $lines = [
        'Form:    ' . $type,
        'Name:    ' . $data['name'],
        'Email:   ' . $data['email'],
    ];
    if ($data['phone']) {
        $lines[] = 'Phone:   ' . $data['phone'];
    }
    if ($data['subject']) {
        $lines[] = 'Subject: ' . $data['subject'];
    }
    foreach ($data['extra'] as $key => $value) {
        if (is_scalar($value) && $value !== '') {
            $lines[] = str_pad(ucwords(str_replace('_', ' ', $key)) . ':', 9)
                . (is_bool($value) ? ($value ? 'Yes' : 'No') : $value);
        }
    }
    $lines[] = '';
    $lines[] = str_repeat('-', 50);
    $lines[] = '';
    $lines[] = $data['message'];
    $lines[] = '';
    $lines[] = str_repeat('-', 50);
    $lines[] = 'Stored in WordPress: ' . get_edit_post_link($post_id, '');

    $headers = [];
    if (is_email($data['email'])) {
        $headers[] = sprintf('Reply-To: %s <%s>', $data['name'], $data['email']);
    }

    return wp_mail(kova_forms_recipient(), $subject, implode("\n", $lines), $headers);
}

// The endpoint

function kova_forms_rate_limited($ip) {
    if (!$ip) {
        return false;
    }
    $key   = 'kova_forms_' . md5($ip);
    $count = (int) get_transient($key);
    if ($count >= 5) {
        return true;
    }
    set_transient($key, $count + 1, 10 * MINUTE_IN_SECONDS);
    return false;
}

add_action('rest_api_init', function () {
    register_rest_route('kova/v1', '/message', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'kova_forms_handle',
    ]);
});

function kova_forms_handle(WP_REST_Request $request) {
    $secret = kova_forms_secret();
    if (!$secret) {
        return new WP_Error(
            'kova_forms_unconfigured',
            'No shared secret configured. Set one at WooCommerce -> KOVA Bridge.',
            ['status' => 503]
        );
    }

    $raw       = $request->get_body();
    $signature = (string) $request->get_header('x-kova-signature');
    $expected  = hash_hmac('sha256', $raw, $secret);

    if (!$signature || !hash_equals($expected, $signature)) {
        return new WP_Error('kova_forms_bad_signature', 'Bad signature.', ['status' => 401]);
    }

    $body = json_decode($raw, true);
    if (!is_array($body)) {
        return new WP_Error('kova_forms_bad_body', 'Malformed body.', ['status' => 400]);
    }

    $ip = $request->get_header('x-kova-client-ip');
    if (kova_forms_rate_limited($ip)) {
        return new WP_Error(
            'kova_forms_rate_limited',
            'Too many submissions. Try again shortly.',
            ['status' => 429]
        );
    }

    $extra = isset($body['extra']) && is_array($body['extra']) ? $body['extra'] : [];
    $data  = [
        'type'    => ($body['type'] ?? '') === 'wholesale' ? 'wholesale' : 'contact',
        'name'    => sanitize_text_field($body['name'] ?? ''),
        'email'   => sanitize_email($body['email'] ?? ''),
        'phone'   => sanitize_text_field($body['phone'] ?? ''),
        'subject' => sanitize_text_field($body['subject'] ?? ''),
        'message' => sanitize_textarea_field($body['message'] ?? ''),
        'extra'   => array_map(function ($v) {
            return is_scalar($v) ? sanitize_text_field((string) $v) : '';
        }, $extra),
    ];

    if (!$data['name'] || !is_email($data['email']) || !$data['message']) {
        return new WP_Error(
            'kova_forms_incomplete',
            'Name, a valid email, and a message are required.',
            ['status' => 400]
        );
    }

    $post_id = wp_insert_post([
        'post_type'    => KOVA_MESSAGE_CPT,
        'post_status'  => 'publish',
        'post_title'   => $data['name'] . ($data['subject'] ? ': ' . $data['subject'] : ''),
        'post_content' => $data['message'],
    ], true);

    if (is_wp_error($post_id)) {
        return new WP_Error('kova_forms_store_failed', 'Could not store the message.', ['status' => 500]);
    }

    update_post_meta($post_id, 'kova_form_type', $data['type']);
    update_post_meta($post_id, 'kova_name', $data['name']);
    update_post_meta($post_id, 'kova_email', $data['email']);
    update_post_meta($post_id, 'kova_phone', $data['phone']);
    update_post_meta($post_id, 'kova_subject', $data['subject']);
    update_post_meta($post_id, 'kova_extra', $data['extra']);

    $mailed = kova_forms_send_mail($post_id, $data);
    update_post_meta($post_id, 'kova_mailed', $mailed ? 'yes' : 'no');

    return rest_ensure_response([
        'ok'     => true,
        'stored' => $post_id,
        'mailed' => (bool) $mailed,
    ]);
}

add_action('admin_notices', function () {
    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== KOVA_MESSAGE_CPT) {
        return;
    }
    $failed = get_posts([
        'post_type'      => KOVA_MESSAGE_CPT,
        'posts_per_page' => 1,
        'meta_key'       => 'kova_mailed',
        'meta_value'     => 'no',
        'fields'         => 'ids',
    ]);
    if ($failed) {
        echo '<div class="notice notice-warning"><p><strong>Some messages could not be emailed.</strong> '
            . 'They are stored here and safe, but delivery failed. Check WP Mail SMTP, or whichever '
            . 'mailer sends your WooCommerce order emails.</p></div>';
    }
});
