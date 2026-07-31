<?php
/**
 * Render: Inhalts-Karte
 *
 * @package UD_Betreuungsparadies
 */

$is_active = isset( $attributes['isActive'] ) ? (bool) $attributes['isActive'] : true;

if ( ! $is_active ) {
	return '';
}

$gradient   = isset( $attributes['gradient'] ) ? (string) $attributes['gradient'] : '';
$card_width = isset( $attributes['cardWidth'] ) ? (string) $attributes['cardWidth'] : '';

$classes = array(
	'ud-content-card',
	'ud-betreuungsparadies-card',
);

$styles = array();

if ( '' !== $gradient ) {
	$styles[] = sprintf(
		'background:%s',
		esc_attr( $gradient )
	);
}

if ( '' !== $card_width ) {
	$styles[] = sprintf(
		'--ud-content-card-width:%s',
		esc_attr( $card_width )
	);
}

$wrapper_attributes_args = array(
	'class' => implode( ' ', $classes ),
);

if ( ! empty( $styles ) ) {
	$wrapper_attributes_args['style'] = implode( ';', $styles );
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attributes_args );
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>