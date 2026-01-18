<?php
/**
 * Plugin Name: Galleryberg Gallery Block Pro
 * Plugin URI: https://galleryberg.com/pro
 * Description: Professional gallery layouts and features for Galleryberg
 * Version: 1.0.9
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Imtiaz Rayhan
 * License: GPL-2.0-or-later
 * Text Domain: galleryberg-gallery-block-pro
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! function_exists( 'gp_fs' ) ) {
	// Create a helper function for easy SDK access.
	function gp_fs() {
		global $gp_fs;

		if ( ! isset( $gp_fs ) ) {
			// Include Freemius SDK.
			if ( file_exists( dirname( dirname( __FILE__ ) ) . '/galleryberg-gallery-block/freemius/start.php' ) ) {
				// Try to load SDK from parent plugin folder.
				require_once dirname( dirname( __FILE__ ) ) . '/galleryberg-gallery-block/freemius/start.php';
			} elseif ( file_exists( dirname( dirname( __FILE__ ) ) . '/galleryberg-gallery-block-pro/freemius/start.php' ) ) {
				// Try to load SDK from premium parent plugin folder.
				require_once dirname( dirname( __FILE__ ) ) . '/galleryberg-gallery-block-pro/freemius/start.php';
			} else {
				require_once dirname( __FILE__ ) . '/vendor/freemius/start.php';
			}

			$gp_fs = fs_dynamic_init( array(
				'id'                  => '21744',
				'slug'                => 'galleryberg-gallery-block-pro',
				'premium_slug'        => 'galleryberg-gallery-block-pro',
				'type'                => 'plugin',
				'public_key'          => 'pk_ec5e8b98e2054223c050b785858a2',
				'is_premium'          => true,
				'is_premium_only'     => true,
				'has_paid_plans'      => true,
				'is_org_compliant'    => false,
				'parent'              => array(
					'id'         => '21743',
					'slug'       => 'galleryberg-gallery-block',
					'public_key' => 'pk_76372b4a6fdc50cc1d28d1ee6efc8',
					'name'       => 'Galleryberg Gallery Block',
				),
				'menu'                => array(
					'first-path'     => 'plugins.php',
					'support'        => false,
				),
			) );
		}

		return $gp_fs;
	}
}

// Define constants
define( 'GALLERYBERG_PRO_VERSION', '1.0.9' );
define( 'GALLERYBERG_PRO_PATH', plugin_dir_path( __FILE__ ) );
define( 'GALLERYBERG_PRO_URL', plugin_dir_url( __FILE__ ) );

// Load Composer autoloader
if ( file_exists( GALLERYBERG_PRO_PATH . 'vendor/autoload.php' ) ) {
	require_once GALLERYBERG_PRO_PATH . 'vendor/autoload.php';
}

function gp_fs_is_parent_active_and_loaded() {
	// Check if the parent's init SDK method exists.
	return function_exists( 'gal_fs' );
}

function gp_fs_is_parent_active() {
	$active_plugins = get_option( 'active_plugins', array() );

	if ( is_multisite() ) {
		$network_active_plugins = get_site_option( 'active_sitewide_plugins', array() );
		$active_plugins         = array_merge( $active_plugins, array_keys( $network_active_plugins ) );
	}

	foreach ( $active_plugins as $basename ) {
		if ( 0 === strpos( $basename, 'galleryberg-gallery-block/' ) ||
			 0 === strpos( $basename, 'galleryberg-gallery-block-pro/' )
		) {
			return true;
		}
	}

	return false;
}

function gp_fs_init() {
	if ( gp_fs_is_parent_active_and_loaded() ) {
		// Init Freemius.
		gp_fs();

		// Signal that the add-on's SDK was initiated.
		do_action( 'gp_fs_loaded' );

		// Parent is active, add your init code here.
		if ( ! class_exists( 'Galleryberg_Gallery_Block_Pro' ) ) {
			/**
			 * Galleryberg Pro main class.
			 */
			class Galleryberg_Gallery_Block_Pro {
				public function __construct() {
					// Initialize assets
					if(gp_fs()->has_active_valid_license()){

					new \Galleryberg\Pro\Assets();

					// Initialize Gallery block extensions
					new \Galleryberg\Pro\Block_Extensions\Gallery();

					// Initialize Image block extensions
					new \Galleryberg\Pro\Block_Extensions\Image();
					}
				}
			}
			new Galleryberg_Gallery_Block_Pro();
		}

	} else {
		// Parent is inactive, add your error handling here.
	}
}

if ( gp_fs_is_parent_active_and_loaded() ) {
	// If parent already included, init add-on.
	gp_fs_init();
} elseif ( gp_fs_is_parent_active() ) {
	// Init add-on only after the parent is loaded.
	add_action( 'gal_fs_loaded', 'gp_fs_init' );
} else {
	// Even though the parent is not activated, execute add-on for activation / uninstall hooks.
	gp_fs_init();
}
add_action( 'admin_init', function () {
	if ( ! is_plugin_active( 'galleryberg-gallery-block/galleryberg-gallery-block.php' ) ) {
		if ( is_plugin_active( 'galleryberg-gallery-block-pro/galleryberg-gallery-block-pro.php' ) ) {
			deactivate_plugins( 'galleryberg-gallery-block-pro/galleryberg-gallery-block-pro.php' );
			add_action( 'admin_notices', function () {
				echo '<div class="notice notice-warning is-dismissible">
						<p>Galleryberg Gallery Block Pro has been deactivated because Galleryberg Gallery Block is not active.</p>
						</div>';
			} );
		}
	}
} );
