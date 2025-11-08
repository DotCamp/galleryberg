<?php
/**
 * Image Block Extension
 *
 * @package Galleryberg\Pro
 */

namespace Galleryberg\Pro\Block_Extensions;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Image extension class
 */
class Image {

	public function __construct() {
		add_filter( 'galleryberg_image_wrapper_styles', [ $this, 'getImageWrapperStyles' ], 10, 3 );
	}

	public function getImageWrapperStyles( $styles, $attributes, $context ) {
		if ( isset( $context['layout'] ) && 'mosaic' === $context['layout'] ) {
			$mosaic_span_x = isset( $attributes['mosaicSpanX'] ) ? intval( $attributes['mosaicSpanX'] ) : 1;
			$mosaic_span_y = isset( $attributes['mosaicSpanY'] ) ? intval( $attributes['mosaicSpanY'] ) : 1;
			if ( $mosaic_span_x > 1 ) {
				$styles['grid-column'] = 'span ' . $mosaic_span_x;
			}
			if ( $mosaic_span_y > 1 ) {
				$styles['grid-row'] = 'span ' . $mosaic_span_y;
			}
		}
		return $styles;
	}

}
