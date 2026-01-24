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
		add_filter( 'render_block_galleryberg/image', [ $this, 'addLazyLoadingAttributes' ], 10, 3 );
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

	/**
	 * Get shimmer placeholder URL.
	 *
	 * @return string URL to shimmer SVG file.
	 */
	private function getShimmerPlaceholderUrl() {
		return plugins_url( 'assets/shimmer-placeholder.svg', dirname( dirname( __FILE__ ) ) );
	}

	/**
	 * Add custom lazy-loading attributes to Galleryberg image output (Pro only).
	 *
	 * @param string $block_content Rendered block content.
	 * @param array  $block         Block data.
	 *
	 * @return string
	 */
	public function addLazyLoadingAttributes( $block_content, $block, $instance ) {
		if ( is_admin() ) {
			return $block_content;
		}

		$attrs   = isset( $block['attrs'] ) ? $block['attrs'] : array();
		$context = isset( $instance->context) ? $instance->context: array();
		$enable_lazy = false;
		if ( isset( $attrs['enableLazyLoading'] ) ) {
			$enable_lazy = (bool) $attrs['enableLazyLoading'];
		} elseif ( isset( $context['galleryberg/enableLazyLoading'] ) ) {
			$enable_lazy = (bool) $context['galleryberg/enableLazyLoading'];
		}
		if ( ! $enable_lazy ) {
			return $block_content;
		}

		if ( false === strpos( $block_content, '<img' ) ) {
			return $block_content;
		}

		$placeholder = $this->getShimmerPlaceholderUrl();

		$internal_errors = libxml_use_internal_errors( true );
		$dom             = new \DOMDocument();
		$loaded          = $dom->loadHTML( '<?xml encoding="utf-8"?>' . $block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_clear_errors();
		libxml_use_internal_errors( $internal_errors );

		if ( ! $loaded ) {
			return $block_content;
		}

		$images = $dom->getElementsByTagName( 'img' );
		if ( ! $images || 0 === $images->length ) {
			return $block_content;
		}

		foreach ( $images as $img ) {
			if ( $img->hasAttribute( 'data-src' ) ) {
				continue;
			}

			$src = $img->getAttribute( 'src' );
			if ( $src ) {
				$img->setAttribute( 'data-src', $src );
				$img->setAttribute( 'src', $placeholder );
			}

			if ( $img->hasAttribute( 'srcset' ) ) {
				$img->setAttribute( 'data-srcset', $img->getAttribute( 'srcset' ) );
				$img->removeAttribute( 'srcset' );
			}
			if ( $img->hasAttribute( 'sizes' ) ) {
				$img->setAttribute( 'data-sizes', $img->getAttribute( 'sizes' ) );
				$img->removeAttribute( 'sizes' );
			}

			if ( ! $img->hasAttribute( 'decoding' ) ) {
				$img->setAttribute( 'decoding', 'async' );
			}

			$existing_class = $img->getAttribute( 'class' );
			if ( false === strpos( $existing_class, 'galleryberg-lazy' ) ) {
				$img->setAttribute( 'class', trim( $existing_class . ' galleryberg-lazy' ) );
			}
		}

		return $dom->saveHTML();
	}

}
