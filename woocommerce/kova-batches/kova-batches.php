<?php
/**
 * Plugin Name: KOVA Batches & COAs
 * Description: Batch records with certificates of analysis. Each batch links to a WooCommerce product, carries its purity result and test date, and holds the COA PDF. Exposes a public read-only API the storefront uses for batch lookup, the recent-batches list, and the current-batch block on product pages.
 * Version: 1.0.0
 * Author: ShehabDev
 */

if (!defined('ABSPATH')) {
    exit;
}

const KOVA_BATCH_CPT = 'kova_batch';

function kova_batch_meta_keys() {
    return [
        'kova_product_id' => 'integer', // WooCommerce product this lot is of
        'kova_tested_on'  => 'string',  // ISO date, e.g. 2026-06-08
        'kova_purity'     => 'string',  // as reported, e.g. "99.4%"
        'kova_method'     => 'string',  // e.g. "HPLC"
        'kova_lab'        => 'string',  // e.g. "Independent"
        'kova_coa_id'     => 'integer', // media library attachment ID of the PDF
    ];
}

// The post type

add_action('init', function () {
    register_post_type(KOVA_BATCH_CPT, [
        'labels' => [
            'name'          => 'Batches',
            'singular_name' => 'Batch',
            'add_new_item'  => 'Add Batch',
            'edit_item'     => 'Edit Batch',
            'search_items'  => 'Search batches',
            'not_found'     => 'No batches yet.',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-clipboard',
        'supports'     => ['title'],
        'has_archive'  => false,
        'rewrite'      => false,
    ]);

    foreach (kova_batch_meta_keys() as $key => $type) {
        register_post_meta(KOVA_BATCH_CPT, $key, [
            'type'          => $type,
            'single'        => true,
            'show_in_rest'  => true,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
});

// Edit screen

add_action('add_meta_boxes', function () {
    add_meta_box(
        'kova_batch_details',
        'Batch Details',
        'kova_batch_metabox',
        KOVA_BATCH_CPT,
        'normal',
        'high'
    );
});

add_action('admin_enqueue_scripts', function ($hook) {
    if (in_array($hook, ['post.php', 'post-new.php'], true)
        && get_post_type() === KOVA_BATCH_CPT) {
        wp_enqueue_media();
    }
});

function kova_batch_metabox($post) {
    wp_nonce_field('kova_batch_save', 'kova_batch_nonce');

    $values = [];
    foreach (array_keys(kova_batch_meta_keys()) as $key) {
        $values[$key] = get_post_meta($post->ID, $key, true);
    }

    $coa_url  = $values['kova_coa_id'] ? wp_get_attachment_url($values['kova_coa_id']) : '';
    $products = function_exists('wc_get_products')
        ? wc_get_products([
            'limit'   => -1,
            'status'  => 'publish',
            'orderby' => 'name',
            'order'   => 'ASC',
        ])
        : [];
    ?>
    <style>
        .kova-field { margin: 0 0 18px; }
        .kova-field label { display: block; font-weight: 600; margin-bottom: 5px; }
        .kova-field input[type=text],
        .kova-field input[type=date],
        .kova-field select { width: 100%; max-width: 420px; }
        .kova-hint { color: #666; font-size: 12px; margin-top: 4px; }
        .kova-missing { color: #b32d2e; }
        .kova-ok { color: #007017; }
    </style>

    <p class="kova-hint">
        The batch number is the post title above. Type it exactly as it is
        printed on the vial, including any dashes. That is what a customer will
        enter on the verification page, and what the QR code resolves to.
    </p>

    <div class="kova-field">
        <label for="kova_product_id">Product</label>
        <select name="kova_product_id" id="kova_product_id">
            <option value="">Select a product</option>
            <?php foreach ($products as $product) : ?>
                <option value="<?php echo esc_attr($product->get_id()); ?>"
                    <?php selected((int) $values['kova_product_id'], $product->get_id()); ?>>
                    <?php echo esc_html($product->get_name()); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <?php if (!$products) : ?>
            <p class="kova-hint kova-missing">No products found. Is WooCommerce active?</p>
        <?php endif; ?>
    </div>

    <div class="kova-field">
        <label for="kova_purity">Purity result</label>
        <input type="text" name="kova_purity" id="kova_purity"
               value="<?php echo esc_attr($values['kova_purity']); ?>"
               placeholder="99.4%">
        <p class="kova-hint">
            Enter the figure the lab actually reported for this lot. It is shown
            to customers verbatim, so do not round it up.
        </p>
    </div>

    <div class="kova-field">
        <label for="kova_method">Test method</label>
        <input type="text" name="kova_method" id="kova_method"
               value="<?php echo esc_attr($values['kova_method'] ? $values['kova_method'] : 'HPLC'); ?>">
    </div>

    <div class="kova-field">
        <label for="kova_tested_on">Test date</label>
        <input type="date" name="kova_tested_on" id="kova_tested_on"
               value="<?php echo esc_attr($values['kova_tested_on']); ?>">
    </div>

    <div class="kova-field">
        <label for="kova_lab">Laboratory</label>
        <input type="text" name="kova_lab" id="kova_lab"
               value="<?php echo esc_attr($values['kova_lab'] ? $values['kova_lab'] : 'Independent'); ?>">
        <p class="kova-hint">
            Only claim an accreditation (ISO 17025 or equivalent) here if the
            certificate for it is on file.
        </p>
    </div>

    <div class="kova-field">
        <label>COA document (PDF)</label>
        <input type="hidden" name="kova_coa_id" id="kova_coa_id"
               value="<?php echo esc_attr($values['kova_coa_id']); ?>">
        <p>
            <button type="button" class="button" id="kova-coa-pick">Select or upload PDF</button>
            <button type="button" class="button-link" id="kova-coa-clear"
                    style="margin-left:10px;<?php echo $coa_url ? '' : 'display:none;'; ?>">Remove</button>
        </p>
        <p id="kova-coa-current">
            <?php if ($coa_url) : ?>
                <a href="<?php echo esc_url($coa_url); ?>" target="_blank" rel="noopener">
                    <?php echo esc_html(basename($coa_url)); ?>
                </a>
            <?php else : ?>
                <em>No document attached.</em>
            <?php endif; ?>
        </p>
        <p class="kova-hint">
            A batch with no COA attached is skipped by the storefront. It
            will not appear in the batch lookup or the recent batches list.
            Attach the document before you publish.
        </p>
    </div>

    <script>
    jQuery(function ($) {
        var frame;
        $('#kova-coa-pick').on('click', function (e) {
            e.preventDefault();
            if (frame) { frame.open(); return; }
            frame = wp.media({
                title: 'Select the COA PDF',
                button: { text: 'Use this document' },
                library: { type: ['application/pdf', 'image'] },
                multiple: false
            });
            frame.on('select', function () {
                var doc = frame.state().get('selection').first().toJSON();
                $('#kova_coa_id').val(doc.id);
                $('#kova-coa-current').empty().append(
                    $('<a>', { href: doc.url, target: '_blank', rel: 'noopener' })
                        .text(doc.filename || doc.url)
                );
                $('#kova-coa-clear').show();
            });
            frame.open();
        });
        $('#kova-coa-clear').on('click', function (e) {
            e.preventDefault();
            $('#kova_coa_id').val('');
            $('#kova-coa-current').html('<em>No document attached.</em>');
            $(this).hide();
        });
    });
    </script>
    <?php
}

add_action('save_post_' . KOVA_BATCH_CPT, function ($post_id) {
    if (!isset($_POST['kova_batch_nonce'])
        || !wp_verify_nonce($_POST['kova_batch_nonce'], 'kova_batch_save')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    foreach (kova_batch_meta_keys() as $key => $type) {
        if (!isset($_POST[$key])) {
            continue;
        }
        $raw = wp_unslash($_POST[$key]);
        update_post_meta(
            $post_id,
            $key,
            $type === 'integer' ? (int) $raw : sanitize_text_field($raw)
        );
    }
});

add_filter('manage_' . KOVA_BATCH_CPT . '_posts_columns', function ($columns) {
    return [
        'cb'        => $columns['cb'],
        'title'     => 'Batch number',
        'kova_prod' => 'Product',
        'kova_pur'  => 'Purity',
        'kova_date' => 'Tested',
        'kova_coa'  => 'COA',
    ];
});

add_action('manage_' . KOVA_BATCH_CPT . '_posts_custom_column', function ($column, $post_id) {
    switch ($column) {
        case 'kova_prod':
            $product_id = get_post_meta($post_id, 'kova_product_id', true);
            $title      = $product_id ? get_the_title($product_id) : '';
            echo $title
                ? esc_html($title)
                : '<span class="kova-missing" style="color:#b32d2e">Not set</span>';
            break;

        case 'kova_pur':
            $purity = get_post_meta($post_id, 'kova_purity', true);
            echo esc_html($purity ? $purity : 'None');
            break;

        case 'kova_date':
            $tested = get_post_meta($post_id, 'kova_tested_on', true);
            echo esc_html($tested ? $tested : 'None');
            break;

        case 'kova_coa':
            $coa_id = get_post_meta($post_id, 'kova_coa_id', true);
            echo $coa_id && wp_get_attachment_url($coa_id)
                ? '<span style="color:#007017">Attached</span>'
                : '<span style="color:#b32d2e">Missing</span>';
            break;
    }
}, 10, 2);

// Public read-only API

function kova_batch_is_servable($post_id) {
    $coa_id = get_post_meta($post_id, 'kova_coa_id', true);
    return (bool) ($coa_id && wp_get_attachment_url($coa_id));
}

function kova_batch_payload($post) {
    $product_id = (int) get_post_meta($post->ID, 'kova_product_id', true);
    $product    = $product_id && function_exists('wc_get_product')
        ? wc_get_product($product_id)
        : null;
    $coa_id     = (int) get_post_meta($post->ID, 'kova_coa_id', true);

    return [
        'batch'       => $post->post_title,
        'purity'      => (string) get_post_meta($post->ID, 'kova_purity', true),
        'method'      => (string) get_post_meta($post->ID, 'kova_method', true),
        'testedOn'    => (string) get_post_meta($post->ID, 'kova_tested_on', true),
        'laboratory'  => (string) get_post_meta($post->ID, 'kova_lab', true),
        'coaUrl'      => $coa_id ? wp_get_attachment_url($coa_id) : '',
        'productName' => $product ? $product->get_name() : '',
        'productSlug' => $product ? $product->get_slug() : '',
    ];
}

function kova_batch_query($args = []) {
    $query_args = array_merge([
        'post_type'      => KOVA_BATCH_CPT,
        'post_status'    => 'publish',
        'posts_per_page' => 100,
        'meta_key'       => 'kova_tested_on',
        'orderby'        => 'meta_value',
        'order'          => 'DESC',
    ], $args);

    return array_values(array_filter(
        get_posts($query_args),
        function ($post) {
            return kova_batch_is_servable($post->ID);
        }
    ));
}

add_action('rest_api_init', function () {
    // GET /wp-json/kova/v1/batches?per_page=8&product=bpc-157
    register_rest_route('kova/v1', '/batches', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'args'                => [
            'per_page' => [
                'default'           => 20,
                'sanitize_callback' => 'absint',
            ],
            'product'  => [
                'default'           => '',
                // Deliberately wrapped rather than passing 'sanitize_title'
                'sanitize_callback' => function ($value) {
                    return sanitize_title($value);
                },
            ],
        ],
        'callback'            => function ($request) {
            $args = [];

            $slug = $request->get_param('product');
            if ($slug) {
                $product = get_page_by_path($slug, OBJECT, 'product');
                // Unknown slug: short circuit to an empty result rather than
                if (!$product) {
                    return rest_ensure_response([]);
                }
                $product_id = (int) $product->ID;
                $args['meta_query'] = [
                    'relation' => 'AND',
                    [
                        'key'   => 'kova_product_id',
                        'value' => $product_id,
                    ],
                ];
            }

            $posts = kova_batch_query($args);
            $posts = array_slice($posts, 0, $request->get_param('per_page'));

            return rest_ensure_response(array_map('kova_batch_payload', $posts));
        },
    ]);

    // GET /wp-json/kova/v1/batch/KV-2408-BPC
    register_rest_route('kova/v1', '/batch/(?P<number>[^/]+)', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function ($request) {
            $number = trim(urldecode($request['number']));

            // Matched case-insensitively on the title: a customer reading a
            foreach (kova_batch_query(['posts_per_page' => -1]) as $post) {
                if (strcasecmp(trim($post->post_title), $number) === 0) {
                    return rest_ensure_response(kova_batch_payload($post));
                }
            }

            return new WP_Error(
                'kova_batch_not_found',
                'No published batch with that number.',
                ['status' => 404]
            );
        },
    ]);
});
