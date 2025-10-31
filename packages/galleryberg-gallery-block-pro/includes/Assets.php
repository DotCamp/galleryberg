<?php
/**
 * Register block assets
 *
 * @package Galleryberg\Pro
 */

namespace Galleryberg\Pro;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Assets
 *
 * Handles asset registration and enqueuing for pro features
 */
class Assets {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}

	/**
	 * Enqueue frontend assets
	 */
	public function enqueue_frontend_assets() {
		wp_enqueue_style( 'galleryberg-pro-block-frontend-style' );
	}

	/**
	 * Enqueue block editor assets
	 */
	public function enqueue_block_editor_assets() {
		wp_enqueue_script( 'galleryberg-pro-block-editor-script' );
		wp_enqueue_style( 'galleryberg-pro-block-editor-style' );
	}

	/**
	 * Register block assets
	 */
	public function register_block_assets() {
		// Register Pro block editor script
		wp_register_script(
			'galleryberg-pro-block-editor-script',
			GALLERYBERG_PRO_URL . 'build/index.js',
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n' ),
			GALLERYBERG_PRO_VERSION
		);

		// Register Pro block editor styles
		wp_register_style(
			'galleryberg-pro-block-editor-style',
			GALLERYBERG_PRO_URL . 'build/index.css',
			array(),
			GALLERYBERG_PRO_VERSION
		);

		// Register Pro block frontend styles
		wp_register_style(
			'galleryberg-pro-block-frontend-style',
			GALLERYBERG_PRO_URL . 'packages/galleryberg-pro/build/frontend.css',
			array(),
			GALLERYBERG_PRO_VERSION
		);
	}
}

