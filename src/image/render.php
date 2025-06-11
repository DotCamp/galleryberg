<?php
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


$style = [
	'border-top-left-radius'     => isset($border_radius['topLeft']) ? $border_radius['topLeft'] : '',
	'border-top-right-radius'    => isset($border_radius['topRight']) ? $border_radius['topRight'] : '',
	'border-bottom-left-radius'  => isset($border_radius['bottomLeft']) ? $border_radius['bottomLeft'] : '',
	'border-bottom-right-radius' => isset($border_radius['bottomRight']) ? $border_radius['bottomRight'] : '',
	'aspect-ratio'               => $aspect_ratio ? $aspect_ratio : '',
	'object-fit'                 => $scale ? $scale : '',
	'width'                      => $width ? "{$width}px" : '',
	'height'                     => $height ? "{$height}px" : '',
];
if ( isset($context['layout']) && $context['layout'] === 'justified' ) {
	if ( isset($context['justifiedRowHeight']) && $context['justifiedRowHeight'] ) {
		$style['height'] = intval($context['justifiedRowHeight']) . 'px';
	}
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
	'id' 	=> $image_id
));

?>
<figure <?php echo $wrapper_attributes; ?>>
	<?php if ($has_href) : ?>
		<a href="<?php echo esc_url($href); ?>" <?php echo $link_class_attr; ?> <?php echo $link_target_attr; ?> <?php echo $new_rel_attr; ?>>
			<img src="<?php echo $img_src; ?>" alt="<?php echo $img_alt; ?>" <?php echo $style_attr; ?> />
		</a>
	<?php else : ?>
		<img src="<?php echo $img_src; ?>" alt="<?php echo $img_alt; ?>" <?php echo $style_attr; ?> />
	<?php endif; ?>
	<?php echo $caption_html; ?>
</figure>
