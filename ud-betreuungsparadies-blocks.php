<?php
/**
 * Plugin Name:     UD Blocks: Betreuungsparadies
 * Description:     Sammlung von Karten-Blöcken für das Betreuungsparadies.
 * Version:         1.0.0
 * Author:          ulrich.digital gmbh
 * Author URI:      https://ulrich.digital/
 * License:         GPL v2 or later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     betreuungsparadies-ud
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UD_BP_PLUGIN_PATH', __DIR__ . '/' );
define( 'UD_BP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Includes laden
 */
require_once __DIR__ . '/includes/block-register.php';
require_once __DIR__ . '/includes/enqueue.php';
require_once __DIR__ . '/includes/helpers.php';

/**
 * CPT Team
 */
require_once __DIR__ . '/includes/post-types/team.php';
require_once __DIR__ . '/includes/taxonomies/team.php';
require_once __DIR__ . '/includes/meta/team.php';
require_once __DIR__ . '/includes/default-terms/team.php';

register_activation_hook( __FILE__, function () {
	ud_team_cpt_register_post_type();
	ud_team_cpt_register_location_taxonomy();
	ud_bp_team_create_default_terms();

	flush_rewrite_rules();
});

register_deactivation_hook( __FILE__, function () {
	flush_rewrite_rules();
});