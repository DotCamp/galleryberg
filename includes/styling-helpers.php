<?php

/**
 * Check is spacing value is presets or custom
 *
 * @param string $value - spacing value.
 */
function galleryberg_spacing_preset( $value ) {

     if ( ! $value || ! is_string( $value ) ) {
          return false;
     }
     return '0' === $value || strpos( $value, 'var:preset|spacing|' ) === 0;
}
/**
 * Return the spacing variable
 *
 * @param string $value - spacing value.
 */
function galleryberg_spacing_preset_css_var( $value ) {
     if ( ! $value ) {
          return null;
     }

     $matches = array();
     preg_match( '/var:preset\|spacing\|(.+)/', $value, $matches );

     if ( empty( $matches ) ) {
          return $value;
     }
     return "var(--wp--preset--spacing--{$matches[1]})";
}
/**
 * Get the spacing css
 *
 * @param array $object - spacing object.
 */
function galleryberg_get_spacing_css( $object ) {
     $css = array();

     foreach ( $object as $key => $value ) {
          if ( galleryberg_spacing_preset( $value ) ) {
               $css[ $key ] = galleryberg_spacing_preset_css_var( $value );
          } else {
               $css[ $key ] = $value;
          }
     }

     return $css;
}

/**
 * Check value is undefined
*
* @param string $value - value.
*/
function galleryberg_is_undefined( $value ) {
          return !isset( $value ) || null === $value   || empty( $value );
     }

/**
 * Generate the css if value is not empty
 *
 * @param object $styles - spacing value.
 */
function galleryberg_generate_css_string( $styles ) {
     $css_string = '';

     foreach ( $styles as $key => $value ) {
          if (
               ! galleryberg_is_undefined( $value ) &&
               false !== $value &&
               ( !is_string( $value ) || ( trim( $value ) !== '' && trim( $value ) !== 'undefined undefined undefined' ) ) &&
               ! empty( $value )
          ) {
               $css_string .= $key . ': ' . $value . '; ';
          }
     }

     return $css_string;
}

/**
 * Get the CSS value for a single side of the border.
 *
 * @param array  $border - border.
 * @param string $side - border side.
 * @return string CSS value for the specified side.
 */
function galleryberg_get_single_side_border_value( $border, $side ) {
     $width = isset($border[ $side ]['width']) ? $border[ $side ]['width'] : '';
     $style = isset($border[ $side ]['style']) ? $border[ $side ]['style'] : '';
     $color = isset($border[ $side ]['color']) ? $border[ $side ]['color'] : '';

     return "{$width} " . ( $width && empty( $border[ $side ]['style'] ) ? 'solid ' : $style ) . (!empty($width) && empty($color) ? "" : $color);
}
/**
 * Check if border has split borders.
 *
 * @param array $border - block border.
 * @return bool Whether the border has split sides.
 */
function galleryberg_has_split_borders( $border = array() ) {
     $sides = array( 'top', 'right', 'bottom', 'left' );
     foreach ( $border as $side => $value ) {
          if ( in_array( $side, $sides, true ) ) {
               return true;
          }
     }

     return false;
}
/**
 * Get the border CSS from attributes.
 *
 * @param array $object - block border.
 * @return array CSS styles for the border.
*/
function galleryberg_get_border_css( $object ) {
     $css = array();

     if ( ! galleryberg_has_split_borders( $object ) ) {
          $css['top']    = $object;
          $css['right']  = $object;
          $css['bottom'] = $object;
          $css['left']   = $object;
          return $css;
     }

     return $object;
}
/**
 * Get border variables for CSS.
 *
 * @param array  $border - border.
 * @param string $slug - slug to use in variable.
 * @return array CSS styles for the border variables.
 */
function galleryberg_get_border_variables_css( $border, $slug ) {
     $border_in_dimensions = galleryberg_get_border_css( $border );
     $border_sides         = array( 'top', 'right', 'bottom', 'left' );
     $borders              = array();

     foreach ( $border_sides as $side ) {
          $side_property             = "--galleryberg-blocks-{$slug}-border-{$side}";
          $side_value                = galleryberg_get_single_side_border_value( $border_in_dimensions, $side );
          $borders[ $side_property ] = $side_value;
     }

     return $borders;
}
/**
 * Get the border CSS properties and values without CSS variables.
 *
 * @param array $border - border array.
 * @return array CSS properties and their values.
 */
function galleryberg_get_border_css_properties( $border ) {
	$border_in_dimensions = galleryberg_get_border_css( $border );
	$border_sides = array( 'top', 'right', 'bottom', 'left' );
	$borders = array();

	foreach ( $border_sides as $side ) {
		$property = "border-{$side}";
		$value = galleryberg_get_single_side_border_value( $border_in_dimensions, $side );
		$borders[ $property ] = $value;
	}

	return $borders;
}
