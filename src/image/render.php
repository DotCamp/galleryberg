<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Render the Galleryberg Image block.
 *
 * @package Galleryberg
 */
$media         = $attributes['media']        ?? [];
$size_slug     = $attributes['sizeSlug']     ?? '';
$url           = $media['sizes'][$size_slug]['url'] ?? $media['url'] ?? '';
$img_alt       = esc_attr($attributes['alt'])	?? '';
$caption       = $attributes['caption']      ?? '';
$align         = $attributes['align']        ?? '';
$href          = $attributes['href']         ?? '';
$link_class    = $attributes['linkClass']    ?? '';
$link_target   = $attributes['linkTarget']   ?? '';
$image_classes = $attributes['imageClasses'] ?? '';
$rel           = $attributes['rel']          ?? '';

$has_href          = !empty($href);
$img_src           = $url ? esc_url($url) : '';
$link_class_attr   = $link_class ? 'class="' . esc_attr($link_class) . '"' : '';
$link_target_attr  = $link_target ? 'target="' . esc_attr($link_target) . '"' : '';
$new_rel_attr      = $rel ? ' rel="' . esc_attr($rel) . '"' : '';
$caption_html      = $caption ? '<figcaption class="wp-element-caption">' . esc_html($caption) . '</figcaption>' : '';
$id                = isset($media['id']) ? $media['id'] : '';


$aspect_ratio  = !empty($attributes['aspectRatio'])  ? esc_attr($attributes['aspectRatio'])  : '';
$scale         = !empty($attributes['scale'])        ? esc_attr($attributes['scale'])        : '';
$width         = isset($attributes['width'])         ? intval($attributes['width'])          : '';
$height        = isset($attributes['height'])        ? intval($attributes['height'])         : '';
$border        = $attributes['border']       ?? [];
$border_radius = !empty($attributes['borderRadius']) ? $attributes['borderRadius'] : [];

$context = $block->context;

// Use gallery-level border radius from context if the image has no border radius set
$effective_border_radius = empty($border_radius) && isset($context['imagesBorderRadius']) ? $context['imagesBorderRadius'] : $border_radius;

$style = [
	'border-top-left-radius'     => isset($effective_border_radius['topLeft']) ? $effective_border_radius['topLeft'] : '',
	'border-top-right-radius'    => isset($effective_border_radius['topRight']) ? $effective_border_radius['topRight'] : '',
	'border-bottom-left-radius'  => isset($effective_border_radius['bottomLeft']) ? $effective_border_radius['bottomLeft'] : '',
	'border-bottom-right-radius' => isset($effective_border_radius['bottomRight']) ? $effective_border_radius['bottomRight'] : '',
	'aspect-ratio'               => $aspect_ratio ? $aspect_ratio : '',
	'object-fit'                 => $scale ? $scale : '',
	'width'                      => $width ? "{$width}px" : '',
	'height'                     => $height ? "{$height}px" : '',
];

$wrapper_styles = [];

if ( isset($context['layout']) && $context['layout'] === 'justified' ) {
	if ( isset($context['justifiedRowHeight']) && $context['justifiedRowHeight'] ) {
		$style['height'] = intval($context['justifiedRowHeight']) . 'px';
	}
} else if ( isset($context['layout']) && $context['layout'] === 'masonry' && isset($context['blockSpacing']) && $context['blockSpacing'] ) {
	$block_gap = galleryberg_spacing_preset_css_var( $context['blockSpacing']['top'] ) ?? '16px';
	$wrapper_styles['margin-bottom'] = $block_gap;
}
$border_css = galleryberg_get_border_css_properties( $border );
$style = array_merge($style, $border_css);

$style_attr = !empty($style) ? 'style="' . galleryberg_generate_css_string($style) . ';' . '"' : '';


$classes = [
	'wp-block-galleryberg-image', 'galleryberg-image'
];

if ( ! empty( $align ) ) {
	$classes[] = 'galleryberg-image-' . $align;
}

if ( ! empty( $size_slug ) ) {
	$classes[] = 'size-' . $size_slug;
}

if ( !empty($width) || !empty($height) ) {
	$classes[] = 'is-resized';
}

$image_id = $id ? 'wp-image-' . esc_attr( $id ) : '';

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' 	=> implode(" ", $classes) ,
	'id' 	=> $image_id,
	'style' 	=> galleryberg_generate_css_string($wrapper_styles),
));

$image_html = '';
if ( $id ) {
	$image_html = wp_get_attachment_image(
		$id,
		$size_slug ? $size_slug : 'full',
		false,
		array_merge(
			[
				'alt'   => $img_alt,
				'style' => galleryberg_generate_css_string( $style ),
				'class' => trim( $image_classes ),
			],
			[] // Add more attributes if needed
		)
	);
}
?>
<figure <?php echo wp_kses_post($wrapper_attributes); ?>>
	<?php
		if ( $has_href ) :
	?>
		<a href="<?php echo esc_url( $href ); ?>" <?php echo esc_attr($link_class_attr); ?> <?php echo esc_attr($link_target_attr); ?> <?php echo esc_attr($new_rel_attr); ?>>
			<?php echo wp_kses_post($image_html); ?>
		</a>
	<?php else : ?>
		<?php echo wp_kses_post($image_html); ?>
	<?php endif; ?>
	<?php echo wp_kses_post( $caption_html ); ?>
</figure>
