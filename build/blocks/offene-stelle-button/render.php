<?php

/**
 * Render: Offene-Stellen-Button
 *
 * @package UD_Betreuungsparadies
 */

if (! defined('ABSPATH')) {
    exit;
}

if (! function_exists('ud_bp_button_blocks_contain_active_job_block')) {
    function ud_bp_button_blocks_contain_active_job_block($blocks) {
        foreach ($blocks as $block) {
            $block_name = $block['blockName'] ?? '';

            if ('ud-betreuungsparadies/offene-stelle' === $block_name) {
                $is_active = $block['attrs']['isActive'] ?? true;

                if (false !== $is_active) {
                    return true;
                }
            }

            if (
                ! empty($block['innerBlocks'])
                && ud_bp_button_blocks_contain_active_job_block($block['innerBlocks'])
            ) {
                return true;
            }
        }

        return false;
    }
}

if (! function_exists('ud_bp_button_has_active_job_block')) {
    function ud_bp_button_has_active_job_block() {
        $query = new WP_Query(
            array(
                'post_type'              => array('page', 'post'),
                'post_status'            => 'publish',
                'posts_per_page'         => -1,
                'fields'                 => 'ids',
                'no_found_rows'          => true,
                'update_post_meta_cache' => false,
                'update_post_term_cache' => false,
            )
        );

        foreach ($query->posts as $post_id) {
            $content = get_post_field('post_content', $post_id);

            if (! has_block('ud-betreuungsparadies/offene-stelle', $content)) {
                continue;
            }

            $blocks = parse_blocks($content);

            if (ud_bp_button_blocks_contain_active_job_block($blocks)) {
                return true;
            }
        }

        return false;
    }
}

$debug = current_user_can('manage_options');
$debug = false;
$text = isset($attributes['text']) ? (string) $attributes['text'] : 'Offene Stellen';
$url  = isset($attributes['url']) ? (string) $attributes['url'] : '/offene-stellen/';

$has_active_job = ud_bp_button_has_active_job_block();

if ($debug) {
    echo '<pre class="ud-debug">';
    echo 'DEBUG Offene-Stellen-Button' . PHP_EOL;
    echo 'render.php wird ausgeführt: ja' . PHP_EOL;
    echo 'Aktive offene Stelle gefunden: ' . ($has_active_job ? 'ja' : 'nein') . PHP_EOL;
    echo '</pre>';
}

if (! $has_active_job) {
    return '';
}

$gradient = isset($attributes['gradient']) ? (string) $attributes['gradient'] : '';

$style = '';

if ($gradient) {
    $style = sprintf(
        'background:%s;',
        esc_attr($gradient)
    );
}

$wrapper_attributes = get_block_wrapper_attributes(
    array(
        'class' => 'ud-offene-stellen-button ud-card-button ud-card-button--internal ud-card-button--style-filled',
    )
);
?>

<div <?php echo $wrapper_attributes; ?>>
    <a
        class="ud-card-button__link"
        href="<?php echo esc_url($url); ?>"
        <?php echo $style ? 'style="' . esc_attr($style) . '"' : ''; ?>>
        <span><?php echo wp_kses_post($text); ?></span>
    </a>
</div>