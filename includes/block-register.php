<?php
/**
 * Registriert alle Blocks des Plugins.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function ud_bp_register_blocks() {
	$blocks_dir = UD_BP_PLUGIN_PATH . 'build/blocks/';

	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	$block_json_files = glob( $blocks_dir . '*/block.json' );

	if ( empty( $block_json_files ) ) {
		return;
	}

	foreach ( $block_json_files as $block_json_file ) {
		register_block_type( dirname( $block_json_file ) );
	error_log( 'UD BP: found block ' . $block_json_file );

	}
}
add_action( 'init', 'ud_bp_register_blocks' );

