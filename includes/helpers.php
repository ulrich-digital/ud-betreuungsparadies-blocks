<?php
/**
 * Gemeinsame Hilfsfunktionen für UD Blocks: Betreuungsparadies.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'render_block', 'ud_bp_team_hero_gradient', 10, 2 );

function ud_bp_team_hero_gradient( $content, $block ) {

	if ( $block['blockName'] !== 'ud-betreuungsparadies/team-hero' ) {
		return $content;
	}

	if ( get_post_type() !== 'ud_team' ) {
		return $content;
	}

	$terms = get_the_terms( get_the_ID(), 'team_standort' );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return $content;
	}

	$slug = $terms[0]->slug;

	$path = plugin_dir_path( __FILE__ ) . '../src/utils/gradients.json';

	if ( ! file_exists( $path ) ) {
		return $content;
	}

	$gradients = json_decode( file_get_contents( $path ), true );

	foreach ( $gradients as $g ) {
		if ( $g['slug'] === $slug ) {

			$gradient = $g['gradient'];

			return preg_replace(
				'/<div([^>]+class="[^"]*ud-team-hero[^"]*"[^>]*)>/',
				'<div$1 style="--ud-team-hero-gradient:' . esc_attr( $gradient ) . ';">',
				$content,
				1
			);
		}
	}

	return $content;
}