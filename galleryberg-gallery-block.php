<?php
/**
 * Plugin Name:       Galleryberg Gallery Block
 * Description:       A customizable gallery block for displaying images in columns with optional cropping and spacing.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       galleryberg-gallery-block
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
if ( ! defined( 'GALLERYBERG_BLOCKS_DIR_PATH' ) ) {
	define( 'GALLERYBERG_BLOCKS_DIR_PATH', \plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'GALLERYBERG_BLOCKS_PLUGIN_URL' ) ) {
	define( 'GALLERYBERG_BLOCKS_PLUGIN_URL', \plugins_url( '/', __FILE__ ) );
}

require_once GALLERYBERG_BLOCKS_DIR_PATH . '/includes/styling-helpers.php';

function galleryberg_gallery_block_init() {
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'galleryberg_gallery_block_init' );
