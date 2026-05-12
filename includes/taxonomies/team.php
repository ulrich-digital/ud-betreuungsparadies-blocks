<?php
/**
 * Registriert die Standort-Taxonomie für Teammitglieder.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function ud_team_cpt_register_location_taxonomy() {
	$labels = [
		'name'              => _x( 'Team-Standorte', 'Taxonomy general name', 'ud-team-cpt-ud' ),
		'singular_name'     => _x( 'Team-Standort', 'Taxonomy singular name', 'ud-team-cpt-ud' ),
		'search_items'      => __( 'Team-Standorte suchen', 'ud-team-cpt-ud' ),
		'all_items'         => __( 'Alle Team-Standorte', 'ud-team-cpt-ud' ),
		'parent_item'       => __( 'Übergeordneter Team-Standort', 'ud-team-cpt-ud' ),
		'parent_item_colon' => __( 'Übergeordneter Team-Standort:', 'ud-team-cpt-ud' ),
		'edit_item'         => __( 'Team-Standort bearbeiten', 'ud-team-cpt-ud' ),
		'update_item'       => __( 'Team-Standort aktualisieren', 'ud-team-cpt-ud' ),
		'add_new_item'      => __( 'Neuen Team-Standort hinzufügen', 'ud-team-cpt-ud' ),
		'new_item_name'     => __( 'Name des neuen Team-Standorts', 'ud-team-cpt-ud' ),
		'menu_name'         => __( 'Team-Standorte', 'ud-team-cpt-ud' ),
	];

	$args = [
		'labels'            => $labels,
		'hierarchical'      => true,
		'public'            => true,
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_nav_menus' => false,
		'show_in_rest'      => true,
		'rewrite'           => [ 'slug' => 'team-standort' ],
	];

	register_taxonomy( 'team_standort', [ 'ud_team' ], $args );
}
add_action( 'init', 'ud_team_cpt_register_location_taxonomy' );
