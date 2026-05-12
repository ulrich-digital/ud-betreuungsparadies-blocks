<?php

/**
 * Render Team Loop Block.
 */

if (! defined('ABSPATH')) {
    exit;
}
$heading        = isset($attributes['heading']) ? sanitize_text_field($attributes['heading']) : '';
$standort       = isset($attributes['standort']) ? sanitize_key($attributes['standort']) : '';
$nur_leitung    = ! empty($attributes['nurLeitung']);
$leitung_zuerst = ! empty($attributes['leitungZuerst']);

$args = [
    'post_type'      => 'ud_team',
    'post_status'    => 'publish',
    'posts_per_page' => -1,
    'orderby'        => 'menu_order title',
    'order'          => 'ASC',
];

if ($standort) {
    $args['tax_query'] = [
        [
            'taxonomy' => 'team_standort',
            'field'    => 'slug',
            'terms'    => $standort,
        ],
    ];
}

if ($nur_leitung) {
    $args['meta_query'] = [
        [
            'key'     => 'team_is_leitung',
            'value'   => '1',
            'compare' => '=',
        ],
    ];
}

$query = new WP_Query($args);

if (! $query->have_posts()) {
    return;
}

$posts = $query->posts;

if ($leitung_zuerst) {
    usort(
        $posts,
        function ($a, $b) {
            $a_is_leitung = (int) get_post_meta($a->ID, 'team_is_leitung', true);
            $b_is_leitung = (int) get_post_meta($b->ID, 'team_is_leitung', true);

            if ($a_is_leitung !== $b_is_leitung) {
                return $b_is_leitung <=> $a_is_leitung;
            }

            return strcasecmp(get_the_title($a), get_the_title($b));
        }
    );
}

if (! function_exists('ud_bp_team_loop_find_block')) {
    function ud_bp_team_loop_find_block($blocks, $block_name) {
        foreach ($blocks as $block) {
            if (isset($block['blockName']) && $block['blockName'] === $block_name) {
                return $block;
            }

            if (! empty($block['innerBlocks'])) {
                $found = ud_bp_team_loop_find_block($block['innerBlocks'], $block_name);

                if ($found) {
                    return $found;
                }
            }
        }

        return null;
    }
}

if (! function_exists('ud_bp_team_loop_get_image')) {
    function ud_bp_team_loop_get_image($team_id) {
        $blocks     = parse_blocks(get_post_field('post_content', $team_id));
        $hero_block = ud_bp_team_loop_find_block($blocks, 'ud-betreuungsparadies/team-hero');

        if (empty($hero_block['innerBlocks'])) {
            return '';
        }

        $image_block = ud_bp_team_loop_find_block($hero_block['innerBlocks'], 'core/image');

        if (! $image_block) {
            return '';
        }

        $image_id = isset($image_block['attrs']['id']) ? (int) $image_block['attrs']['id'] : 0;

        if ($image_id) {
            return wp_get_attachment_image(
                $image_id,
                'large',
                false,
                [
                    'class'   => 'ud-team-loop-card__image',
                    'loading' => 'lazy',
                ]
            );
        }

        if (! empty($image_block['attrs']['url'])) {
            return sprintf(
                '<img class="ud-team-loop-card__image" src="%s" alt="" loading="lazy">',
                esc_url($image_block['attrs']['url'])
            );
        }

        return '';
    }
}

if (! function_exists('ud_bp_team_loop_get_gradient')) {
    function ud_bp_team_loop_get_gradient($team_id) {
        $blocks     = parse_blocks(get_post_field('post_content', $team_id));
        $hero_block = ud_bp_team_loop_find_block($blocks, 'ud-betreuungsparadies/team-hero');

        if (empty($hero_block['attrs']['gradient'])) {
            return '';
        }

        return $hero_block['attrs']['gradient'];
    }
}

if (! function_exists('ud_bp_team_loop_get_function_text_from_blocks')) {
    function ud_bp_team_loop_get_function_text_from_blocks($blocks) {
        foreach ($blocks as $block) {
            if (isset($block['blockName']) && $block['blockName'] === 'ud-betreuungsparadies/content-card') {
                $has_function_heading = false;
                $text_parts           = [];

                foreach ($block['innerBlocks'] ?? [] as $inner_block) {
                    $plain_text = trim(wp_strip_all_tags($inner_block['innerHTML'] ?? ''));

                    if (isset($inner_block['blockName']) && $inner_block['blockName'] === 'core/heading') {
                        if (mb_strtolower($plain_text) === 'funktion') {
                            $has_function_heading = true;
                        }

                        continue;
                    }

                    if ($has_function_heading && $plain_text) {
                        $text_parts[] = $plain_text;
                    }
                }

                if ($has_function_heading && ! empty($text_parts)) {
                    return implode('<br>', array_map('esc_html', $text_parts));
                }
            }

            if (! empty($block['innerBlocks'])) {
                $found = ud_bp_team_loop_get_function_text_from_blocks($block['innerBlocks']);

                if ($found) {
                    return $found;
                }
            }
        }

        return '';
    }
}

if (! function_exists('ud_bp_team_loop_get_function_text')) {
    function ud_bp_team_loop_get_function_text($team_id) {
        $blocks = parse_blocks(get_post_field('post_content', $team_id));

        return ud_bp_team_loop_get_function_text_from_blocks($blocks);
    }
}

$wrapper_attributes = get_block_wrapper_attributes(
    [
        'class' => 'ud-team-loop alignwide',
    ]
);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
        ?>>
<?php if ($heading) : ?>
	<h3 class="ud-team-loop__heading">
		<?php echo esc_html($heading); ?>
	</h3>
<?php endif; ?>

    <div class="ud-team-loop__grid">
        <?php foreach ($posts as $post) : ?>
            <?php
            $team_id       = $post->ID;
            $name          = get_the_title($team_id);
            $email         = get_post_meta($team_id, 'team_email', true);
            $email_label = get_post_meta($team_id, 'team_email_label', true);

            if (! $email_label) {
                $email_label = $name;
            }
            $image         = ud_bp_team_loop_get_image($team_id);
            $gradient      = ud_bp_team_loop_get_gradient($team_id);
            $function_text = ud_bp_team_loop_get_function_text($team_id);
            $permalink     = get_permalink($team_id);

            $style = $gradient ? sprintf(' style="background:%s;"', esc_attr($gradient)) : '';
            ?>
            <article class="ud-team-loop-card ud-betreuungsparadies-card" <?php echo $style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
                                                                            ?>>
                <?php if ($image) : ?>
                    <a class="ud-team-loop-card__media" href="<?php echo esc_url($permalink); ?>">
                        <?php echo $image; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
                        ?>
                    </a>
                <?php endif; ?>

                <div class="ud-team-loop-card__content">
                    <h3 class="ud-team-loop-card__title">
                        <a href="<?php echo esc_url($permalink); ?>">
                            <?php echo esc_html($name); ?>
                        </a>
                    </h3>

                    <?php if ($function_text) : ?>
                        <p class="ud-team-loop-card__function">
                            <?php echo wp_kses_post($function_text); ?>
                        </p>
                    <?php endif; ?>

                    <div class="ud-team-loop-card__links">
                        <?php if ($email) : ?>
                            <div class="ud-card-button ud-card-button--style-outline ud-card-button--email">
                                <a
                                    class="ud-card-button__link"
                                    href="mailto:<?php echo esc_attr(antispambot($email)); ?>">
                                    <?php echo esc_html($email_label); ?>
                                </a>
                            </div>
                        <?php endif; ?>

                        <a
                            class="ud-team-loop-card__more"
                            href="<?php echo esc_url($permalink); ?>"
                            aria-label="<?php echo esc_attr(sprintf('Mehr zu %s', $name)); ?>"></a>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</div>

<?php
wp_reset_postdata();
