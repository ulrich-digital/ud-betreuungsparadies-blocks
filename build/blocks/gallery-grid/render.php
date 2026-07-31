<?php

if (! defined('ABSPATH')) {
	exit;
}

$gradient = isset($attributes['gradient']) ? $attributes['gradient'] : '';

$slots = [
	[
		'key'   => 'Large',
		'class' => 'ud-kita-gallery-grid__item--large',
	],
	[
		'key'   => 'Tall',
		'class' => 'ud-kita-gallery-grid__item--tall',
	],
	[
		'key'   => 'SmallTop',
		'class' => 'ud-kita-gallery-grid__item--small-top',
	],
	[
		'key'   => 'SmallBottom',
		'class' => 'ud-kita-gallery-grid__item--small-bottom',
	],
	[
		'key'   => 'NormalLeft',
		'class' => 'ud-kita-gallery-grid__item--normal-left',
	],
	[
		'key'   => 'NormalMiddle',
		'class' => 'ud-kita-gallery-grid__item--normal-middle',
	],
	[
		'key'   => 'Wide',
		'class' => 'ud-kita-gallery-grid__item--wide',
	],
];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'ud-kita-gallery-grid alignfull',
]);

?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php foreach ($slots as $slot) : 

?>
		<?php
		$key       = $slot['key'];
		$image_id  = isset($attributes["image{$key}Id"]) ? (int) $attributes["image{$key}Id"] : 0;
		$image_url = isset($attributes["image{$key}Url"]) ? esc_url($attributes["image{$key}Url"]) : '';
		$image_alt = isset($attributes["image{$key}Alt"]) ? esc_attr($attributes["image{$key}Alt"]) : '';

		if (! $image_id && ! $image_url) {
			continue;
		}

		$style = $gradient ? sprintf(' style="background:%s;"', esc_attr($gradient)) : '';

		$core_image_attrs = [
			'lightbox'        => [
				'enabled' => true,
			],
			'sizeSlug'        => 'full',
			'linkDestination' => 'none',
			'className'       => 'ud-kita-gallery-grid__image-block',
		];

		if ($image_id) {
			$core_image_attrs['id'] = $image_id;

			$image_html = wp_get_attachment_image(
				$image_id,
				'full',
				false,
				[
					'class'   => 'ud-kita-gallery-grid__image',
					'loading' => 'lazy',
				]
			);
		} else {
			$image_html = sprintf(
				'<img class="ud-kita-gallery-grid__image" src="%s" alt="%s" loading="lazy">',
				$image_url,
				$image_alt
			);
		}

		$core_image_block = [
			'blockName'    => 'core/image',
			'attrs'        => $core_image_attrs,
			'innerBlocks'  => [],
			'innerHTML'    => sprintf(
				'<figure class="wp-block-image size-full">%s</figure>',
				$image_html
			),
			'innerContent' => [
				sprintf(
					'<figure class="wp-block-image size-full">%s</figure>',
					$image_html
				),
			],
		];
		?>

		<figure class="ud-kita-gallery-grid__item <?php echo esc_attr($slot['class']); ?>"<?php echo $style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php echo render_block($core_image_block); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</figure>
	<?php endforeach; ?>
</div>
