<?php
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



$style = array();
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

<div <?php echo $wrapper_attributes; ?>>
	<?php echo $content; ?>
</div>
<?php if ( $lightbox ) : ?>
<!-- Glightbox CDN -->
<?php
// Enqueue Glightbox assets only once
add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_style(
		'glightbox',
		'https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css',
		array(),
		null
	);
	wp_enqueue_script(
		'glightbox',
		'https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js',
		array(),
		null,
		true
	);
});
?>
<?php endif; ?>
