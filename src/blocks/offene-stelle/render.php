<?php
/**
 * Render: Offene Stelle
 *
 * @package UD_Betreuungsparadies
 */

$is_active = isset( $attributes['isActive'] ) ? (bool) $attributes['isActive'] : true;

if ( ! $is_active ) {
	return '';
}

$gradient = isset( $attributes['gradient'] ) ? (string) $attributes['gradient'] : '';

$style = '';

if ( $gradient ) {
	$style = sprintf(
		'background:%s;',
		esc_attr( $gradient )
	);
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'ud-offene-stelle ud-betreuungsparadies-card',
		'style' => $style,
	)
);
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php echo $content; ?>
</div>