<?php
/**
 * Plugin Name: Galleryberg Gallery Block Pro
 * Plugin URI: https://galleryberg.com/pro
 * Description: Professional gallery layouts and features for Galleryberg
 * Version: 1.0.5
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

// Define constants
define( 'GALLERYBERG_PRO_VERSION', '1.0.5' );
define( 'GALLERYBERG_PRO_PATH', plugin_dir_path( __FILE__ ) );
define( 'GALLERYBERG_PRO_URL', plugin_dir_url( __FILE__ ) );

// Load Composer autoloader
if ( file_exists( GALLERYBERG_PRO_PATH . 'vendor/autoload.php' ) ) {
	require_once GALLERYBERG_PRO_PATH . 'vendor/autoload.php';
}

// Parent is active, add your init code here.
if (!class_exists('Galleryberg_Gallery_Block_Pro')) {
	/**
	 * Galleryberg Pro main class.
	 */
	class Galleryberg_Gallery_Block_Pro {
		public function __construct() {
			new \Galleryberg\Pro\Assets();
		}
	}
	new Galleryberg_Gallery_Block_Pro();
}
add_action('admin_init', function () {
    if (!is_plugin_active('galleryberg-gallery-block/galleryberg-gallery-block.php')) {
        if (is_plugin_active('galleryberg-gallery-block-pro/galleryberg-gallery-block-pro.php')) {
            deactivate_plugins('galleryberg-gallery-block-pro/galleryberg-gallery-block-pro.php');
            add_action('admin_notices', function () {
                echo '<div class="notice notice-warning is-dismissible">
                        <p>Galleryberg Gallery Block Pro has been deactivated because Galleryberg Gallery Block is not active.</p>
                      </div>';
            });
        }

    }
});
