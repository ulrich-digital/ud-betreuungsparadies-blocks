<?php
/**
 * Erstellt die Standard-Standorte.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function ud_bp_team_create_default_terms() {
	$terms = [
		'ibach'     => 'Ibach',
		'muotathal' => 'Muotathal',
	];

	foreach ( $terms as $slug => $name ) {
		if ( ! term_exists( $slug, 'team_standort' ) ) {
			wp_insert_term(
				$name,
				'team_standort',
				[
					'slug' => $slug,
				]
			);
		}
	}
}