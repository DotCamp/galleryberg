<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Render the Galleryberg Gallery block.
 *
 * @package Galleryberg
 */


$classes = array('galleryberg-gallery-container');

$align = isset($attributes['align']) ? $attributes['align'] : '';
$columns = isset($attributes['columns']) ? $attributes['columns'] : null;
$lightbox = !empty($attributes['lightbox']);
if ($lightbox) {
    $classes[] = 'galleryberg-has-lightbox';
}

if ($align) {
	$classes[] = 'align' . esc_attr($align);
}
if ($columns !== null) {
	$classes[] = 'columns-' . intval($columns);
} else {
	$classes[] = 'columns-default';
}

$layout = $attributes['layout'] ?? 'tiles';
$classes[] = 'layout-' . esc_attr($layout);

$bg_color = galleryberg_get_background_color_var(
	$attributes,
	"backgroundColor",
	"backgroundGradient"
);
$padding_obj = galleryberg_get_spacing_css($attributes['padding'] ?? array());
$margin_obj = galleryberg_get_spacing_css($attributes['margin'] ?? array());
$bloc_gap = isset($attributes['blockSpacing']['all']) ?  galleryberg_spacing_preset_css_var($attributes['blockSpacing']['all']) : "16px";

$style = array(
	'gap'	=> $bloc_gap,
	'background' => $bg_color,
	'border-top-left-radius' => $attributes['borderRadius']['topLeft'] ?? '',
	'border-top-right-radius' => $attributes['borderRadius']['topRight'] ?? '',
	'border-bottom-left-radius' => $attributes['borderRadius']['bottomLeft'] ?? '',
	'border-bottom-right-radius' => $attributes['borderRadius']['bottomRight'] ?? '',
	'padding-top' => $padding_obj['top'] ?? '',
	'padding-right' => $padding_obj['right'] ?? '',
	'padding-bottom' => $padding_obj['bottom'] ?? '',
	'padding-left' => $padding_obj['left'] ?? '',
	'margin-top' => $margin_obj['top'] ?? '',
	'margin-right' => ($margin_obj['right'] ?? '') . ' !important',
	'margin-bottom' => $margin_obj['bottom'] ?? '',
	'margin-left' => ($margin_obj['left'] ?? '') . ' !important',
	'border-top' => galleryberg_get_single_side_border_value(galleryberg_get_border_css($attributes['border']) ?? [], 'top'),
	'border-left' => galleryberg_get_single_side_border_value(galleryberg_get_border_css($attributes['border']) ?? [], 'left'),
	'border-right' => galleryberg_get_single_side_border_value(galleryberg_get_border_css($attributes['border']) ?? [], 'right'),
	'border-bottom' => galleryberg_get_single_side_border_value(galleryberg_get_border_css($attributes['border']) ?? [], 'bottom'),
);
$layout = $attributes['layout'] ?? 'tiles';
$columns = isset($attributes['columns']) ? intval($attributes['columns']) : 3;

if ($layout === 'tiles' || $layout === 'square') {
	$style['grid-template-columns'] = sprintf('repeat(%d,1fr)', $columns);
}
if ($layout === 'masonry') {
	$style['column-count'] = $columns;
}

// Get block wrapper attributes
$wrapper_args = array( 'class' => implode(" ", $classes), 'style' => galleryberg_generate_css_string($style) );
if ($lightbox) {
    $wrapper_args['data-open-effect'] = esc_attr($attributes['openEffect'] ?? 'zoom');
    $wrapper_args['data-close-effect'] = esc_attr($attributes['closeEffect'] ?? 'zoom');
    $wrapper_args['data-slide-effect'] = esc_attr($attributes['slideEffect'] ?? 'slide');
    $wrapper_args['data-keyboard-navigation'] = empty($attributes['keyboardNavigation']) ? 'false' : 'true';
    $wrapper_args['data-loop'] = empty($attributes['loop']) ? 'false' : 'true';
    $wrapper_args['data-zoomable'] = empty($attributes['zoomable']) ? 'false' : 'true';
    $wrapper_args['data-draggable'] = empty($attributes['draggable']) ? 'false' : 'true';
}

$wrapper_attributes = get_block_wrapper_attributes($wrapper_args);

?>

<div <?php echo wp_kses_post($wrapper_attributes); ?>>
	<?php echo wp_kses_post($content); ?>
</div>
