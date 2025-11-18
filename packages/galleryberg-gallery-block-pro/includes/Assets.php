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
		add_filter( 'block_type_metadata', array( $this, 'add_pro_styles_to_blocks' ) );
	}

	/**
	 * Add pro styles to gallery and image blocks via metadata filter
	 */
	public function add_pro_styles_to_blocks( $metadata ) {
		if ( ! isset( $metadata['name'] ) ) {
			return $metadata;
		}

		// Add pro styles to gallery and image blocks
		if ( $metadata['name'] === 'galleryberg/gallery' ) {
			// Add editor script
			if ( ! isset( $metadata['editorScript'] ) ) {
				$metadata['editorScript'] = array();
			} elseif ( is_string( $metadata['editorScript'] ) ) {
				$metadata['editorScript'] = array( $metadata['editorScript'] );
			}
			$metadata['editorScript'][] = 'galleryberg-pro-block-editor-script';

			// Add editor styles
			if ( ! isset( $metadata['editorStyle'] ) ) {
				$metadata['editorStyle'] = array();
			} elseif ( is_string( $metadata['editorStyle'] ) ) {
				$metadata['editorStyle'] = array( $metadata['editorStyle'] );
			}
			$metadata['editorStyle'][] = 'galleryberg-pro-block-editor-style';

			// Add frontend styles
			if ( ! isset( $metadata['style'] ) ) {
				$metadata['style'] = array();
			} elseif ( is_string( $metadata['style'] ) ) {
				$metadata['style'] = array( $metadata['style'] );
			}
			$metadata['style'][] = 'galleryberg-pro-block-frontend-style';

			// Add frontend script
			if ( ! isset( $metadata['viewScript'] ) ) {
				$metadata['viewScript'] = array();
			} elseif ( is_string( $metadata['viewScript'] ) ) {
				$metadata['viewScript'] = array( $metadata['viewScript'] );
			}
			$metadata['viewScript'][] = 'galleryberg-pro-frontend-script';
		}

		return $metadata;
	}

	/**
	 * Register block assets
	 */
	public function register_block_assets() {
		// Register Pro block editor script
		wp_register_script(
			'galleryberg-pro-block-editor-script',
			GALLERYBERG_PRO_URL . 'build/galleryberg-pro.js',
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n' ),
			GALLERYBERG_PRO_VERSION
		);

		// Check if user has valid license (both premium and active license required)
		$is_premium = function_exists( 'gp_fs' ) && gp_fs()->is_premium() && gp_fs()->has_active_valid_license();

		// Localize script with license status
		wp_localize_script(
			'galleryberg-pro-block-editor-script',
			'gallerybergSettings',
			array(
				'isPremium' => $is_premium,
			)
		);

		// Register Pro block editor styles
		wp_register_style(
			'galleryberg-pro-block-editor-style',
			GALLERYBERG_PRO_URL . 'build/galleryberg-pro-editor.css',
			array(),
			GALLERYBERG_PRO_VERSION
		);

		// Register Pro block frontend styles
		wp_register_style(
			'galleryberg-pro-block-frontend-style',
			GALLERYBERG_PRO_URL . 'build/style-galleryberg-pro-style.css',
			array(),
			GALLERYBERG_PRO_VERSION
		);

		// Register frontend script
		wp_register_script(
			'galleryberg-pro-frontend-script',
			GALLERYBERG_PRO_URL . 'build/galleryberg-pro-frontend.js',
			array( ),
			GALLERYBERG_PRO_VERSION,
			true
		);
	}
}

