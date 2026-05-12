<?php
/**
 * Lädt globale Styles und Scripts für Frontend und Editor.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Lädt Styles für Frontend und Editor-Iframe.
 */
function ud_bp_enqueue_block_assets() {
	$global_css_path = UD_BP_PLUGIN_PATH . 'build/global.css';
	$global_css_url  = UD_BP_PLUGIN_URL . 'build/global.css';

	if ( file_exists( $global_css_path ) ) {
		wp_enqueue_style(
			'ud-bp-global',
			$global_css_url,
			array(),
			filemtime( $global_css_path )
		);
	}

	if ( is_admin() ) {
		$editor_css_path = UD_BP_PLUGIN_PATH . 'build/editor.css';
		$editor_css_url  = UD_BP_PLUGIN_URL . 'build/editor.css';

		if ( file_exists( $editor_css_path ) ) {
			wp_enqueue_style(
				'ud-bp-editor',
				$editor_css_url,
				array(),
				filemtime( $editor_css_path )
			);
		}
	}

	$fa_css_path = UD_BP_PLUGIN_PATH . 'build/fonts/fontawesome/fontawesome.bundle.css';
	$fa_css_url  = UD_BP_PLUGIN_URL . 'build/fonts/fontawesome/fontawesome.bundle.css';

	if ( file_exists( $fa_css_path ) ) {
		wp_enqueue_style(
			'ud-bp-fontawesome',
			$fa_css_url,
			array(),
			filemtime( $fa_css_path )
		);
	}
}
add_action( 'enqueue_block_assets', 'ud_bp_enqueue_block_assets' );

/**
 * Lädt globale Frontend-Scripts und Styles für Block-Styles.
 */
function ud_bp_enqueue_frontend_assets() {
	$image_reveal_js_path    = UD_BP_PLUGIN_PATH . 'build/block-styles/image-scroll-reveal/frontend-script.js';
	$image_reveal_js_url     = UD_BP_PLUGIN_URL . 'build/block-styles/image-scroll-reveal/frontend-script.js';
	$image_reveal_asset_path = UD_BP_PLUGIN_PATH . 'build/block-styles/image-scroll-reveal/frontend-script.asset.php';

	if ( file_exists( $image_reveal_js_path ) && file_exists( $image_reveal_asset_path ) ) {
		$image_reveal_asset = require $image_reveal_asset_path;

		wp_enqueue_script(
			'ud-bp-image-scroll-reveal',
			$image_reveal_js_url,
			$image_reveal_asset['dependencies'],
			filemtime( $image_reveal_js_path ),
			true
		);
	}

	$image_reveal_css_path = UD_BP_PLUGIN_PATH . 'build/block-styles/image-scroll-reveal/frontend-script.css';
	$image_reveal_css_url  = UD_BP_PLUGIN_URL . 'build/block-styles/image-scroll-reveal/frontend-script.css';

	if ( file_exists( $image_reveal_css_path ) ) {
		wp_enqueue_style(
			'ud-bp-image-scroll-reveal',
			$image_reveal_css_url,
			array(),
			filemtime( $image_reveal_css_path )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'ud_bp_enqueue_frontend_assets' );

/**
 * Lädt reine Editor-Scripts.
 */
function ud_bp_enqueue_editor_assets() {
	wp_enqueue_media();

	$image_reveal_editor_js_path    = UD_BP_PLUGIN_PATH . 'build/block-styles/image-scroll-reveal/editor-script.js';
	$image_reveal_editor_js_url     = UD_BP_PLUGIN_URL . 'build/block-styles/image-scroll-reveal/editor-script.js';
	$image_reveal_editor_asset_path = UD_BP_PLUGIN_PATH . 'build/block-styles/image-scroll-reveal/editor-script.asset.php';

	if ( file_exists( $image_reveal_editor_js_path ) && file_exists( $image_reveal_editor_asset_path ) ) {
		$image_reveal_editor_asset = require $image_reveal_editor_asset_path;

		wp_enqueue_script(
			'ud-bp-image-scroll-reveal-editor',
			$image_reveal_editor_js_url,
			$image_reveal_editor_asset['dependencies'],
			filemtime( $image_reveal_editor_js_path ),
			true
		);
	}

	$image_reveal_editor_css_path = UD_BP_PLUGIN_PATH . 'build/block-styles/image-scroll-reveal/editor-script.css';
	$image_reveal_editor_css_url  = UD_BP_PLUGIN_URL . 'build/block-styles/image-scroll-reveal/editor-script.css';

	if ( file_exists( $image_reveal_editor_css_path ) ) {
		wp_enqueue_style(
			'ud-bp-image-scroll-reveal-editor',
			$image_reveal_editor_css_url,
			array(),
			filemtime( $image_reveal_editor_css_path )
		);
	}

	$paragraph_lead_editor_js_path    = UD_BP_PLUGIN_PATH . 'build/block-styles/paragraph-lead/editor-script.js';
	$paragraph_lead_editor_js_url     = UD_BP_PLUGIN_URL . 'build/block-styles/paragraph-lead/editor-script.js';
	$paragraph_lead_editor_asset_path = UD_BP_PLUGIN_PATH . 'build/block-styles/paragraph-lead/editor-script.asset.php';

	if ( file_exists( $paragraph_lead_editor_js_path ) && file_exists( $paragraph_lead_editor_asset_path ) ) {
		$paragraph_lead_editor_asset = require $paragraph_lead_editor_asset_path;

		wp_enqueue_script(
			'ud-bp-paragraph-lead-editor',
			$paragraph_lead_editor_js_url,
			$paragraph_lead_editor_asset['dependencies'],
			filemtime( $paragraph_lead_editor_js_path ),
			true
		);
	}

	$paragraph_lead_editor_css_path = UD_BP_PLUGIN_PATH . 'build/block-styles/paragraph-lead/editor-script.css';
	$paragraph_lead_editor_css_url  = UD_BP_PLUGIN_URL . 'build/block-styles/paragraph-lead/editor-script.css';

	if ( file_exists( $paragraph_lead_editor_css_path ) ) {
		wp_enqueue_style(
			'ud-bp-paragraph-lead-editor',
			$paragraph_lead_editor_css_url,
			array(),
			filemtime( $paragraph_lead_editor_css_path )
		);
	}

	$screen = get_current_screen();

	if ( ! $screen || 'ud_team' !== $screen->post_type ) {
		return;
	}

	$team_editor_js_path    = UD_BP_PLUGIN_PATH . 'build/blocks/team/editor.js';
	$team_editor_js_url     = UD_BP_PLUGIN_URL . 'build/blocks/team/editor.js';
	$team_editor_asset_path = UD_BP_PLUGIN_PATH . 'build/blocks/team/editor.asset.php';

	if ( file_exists( $team_editor_js_path ) && file_exists( $team_editor_asset_path ) ) {
		$team_editor_asset = require $team_editor_asset_path;

		wp_enqueue_script(
			'ud-bp-team-editor',
			$team_editor_js_url,
			$team_editor_asset['dependencies'],
			filemtime( $team_editor_js_path ),
			true
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'ud_bp_enqueue_editor_assets' );