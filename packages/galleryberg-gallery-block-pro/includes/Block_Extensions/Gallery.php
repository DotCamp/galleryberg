<?php
/**
 * Gallery Block Extension
 *
 * @package Galleryberg\Pro
 */

namespace Galleryberg\Pro\Block_Extensions;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Gallery extension class
 */
class Gallery {

	public function __construct() {
		add_filter( 'galleryberg_pro_gallery_classes', [ $this, 'getGalleryClasses' ], 10, 2 );
		add_filter( 'galleryberg_pro_gallery_data_attributes', [ $this, 'getGalleryDataAttributes' ], 10, 2 );
	}

	public function getGalleryClasses($classes, $attributes) {
		$classes = [];

		$is_thumbnails_enable = key_exists('enableThumbnails', $attributes) && $attributes['enableThumbnails'];
		$thumbnail_position = key_exists('thumbnailPosition', $attributes) ? $attributes['thumbnailPosition'] : 'bottom';
		if ( $is_thumbnails_enable ) {
			$classes[] = 'galleryberg-pro-has-thumbnails';
			$classes[] = 'galleryberg-pro-thumbnails-' . $thumbnail_position;

		}

		return $classes;
	}

	public function getGalleryDataAttributes( $data_attrs, $attributes ) {
		$is_thumbnails_enable = isset( $attributes['enableThumbnails'] ) && $attributes['enableThumbnails'];

		if ( $is_thumbnails_enable ) {
			$data_attrs['data-enable-thumbnails']         = 'true';
			$data_attrs['data-thumbnail-position']        = esc_attr( $attributes['thumbnailPosition'] ?? 'bottom' );
			$data_attrs['data-thumbnail-navigation']      = esc_attr( $attributes['thumbnailNavigation'] ?? 'direct' );
			$data_attrs['data-thumbnail-navigation-speed'] = intval( $attributes['thumbnailNavigationSpeed'] ?? 10 );
		}

		return $data_attrs;
	}

}
