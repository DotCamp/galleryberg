<?php
/**
 * Render the Galleryberg Image block.
 *
 * @package Galleryberg
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$media         = $attributes['media'] ?? array();
$size_slug     = $attributes['sizeSlug'] ?? '';
$url           = $media['sizes'][ $size_slug ]['url'] ?? $media['url'] ?? '';
$img_alt       = esc_attr( $attributes['alt'] ) ?? '';
$caption       = $attributes['caption'] ?? '';
$align         = $attributes['align'] ?? '';
$href          = $attributes['href'] ?? '';
$link_class    = $attributes['linkClass'] ?? '';
$link_target   = $attributes['linkTarget'] ?? '';
$image_classes = $attributes['imageClasses'] ?? '';
$rel           = $attributes['rel'] ?? '';

$context = $block->context;

// Use individual image settings or fallback to gallery context
$caption_type       = ! empty( $attributes['captionType'] ) ? $attributes['captionType'] : ( $context['galleryCaptionType'] ?? 'below' );
$caption_visibility = ! empty( $attributes['captionVisibility'] ) ? $attributes['captionVisibility'] : ( $context['galleryCaptionVisibility'] ?? 'always' );
$caption_alignment  = ! empty( $attributes['captionAlignment'] ) ? $attributes['captionAlignment'] : ( $context['galleryCaptionAlignment'] ?? 'left' );
$caption_color      = ! empty( $attributes['captionColor'] ) ? $attributes['captionColor'] : ( $context['galleryCaptionColor'] ?? '' );
$caption_bg_color   = ! empty( $attributes['captionBackgroundColor'] ) ? $attributes['captionBackgroundColor'] : ( $context['galleryCaptionBackgroundColor'] ?? '' );

$has_href         = ! empty( $href );
$img_src          = $url ? esc_url( $url ) : '';
$link_class_attr  = $link_class ? 'class="' . esc_attr( $link_class ) . '"' : '';
$link_target_attr = $link_target ? 'target="' . esc_attr( $link_target ) . '"' : '';
$new_rel_attr     = $rel ? ' rel="' . esc_attr( $rel ) . '"' : '';

// Build caption styles
$caption_styles = array();
if ( $caption_color ) {
	$caption_styles['color'] = esc_attr( $caption_color );
}
if ( $caption_bg_color ) {
	$caption_styles['background-color'] = esc_attr( $caption_bg_color );
}

$caption_style_attr = ! empty( $caption_styles ) ? 'style="' . \Galleryberg\Helpers\Styling_Helpers::generate_css_string( $caption_styles ) . '"' : '';
$caption_classes    = array( 'wp-element-caption' );
if ( $caption_type ) {
	$caption_classes[] = 'caption-type-' . esc_attr( $caption_type );
}
if ( $caption_visibility ) {
	$caption_classes[] = 'caption-visibility-' . esc_attr( $caption_visibility );
}

// Format caption alignment class for both standard (left, center, right) and matrix (top-left, etc.) formats
$caption_alignment_class = '';
if ( $caption_alignment ) {
	// Check if it's a matrix alignment format (contains a space)
	if ( strpos( $caption_alignment, ' ' ) !== false ) {
		// Convert "top center" format to "top-center" for CSS classes
		$caption_alignment_class = 'caption-align-' . str_replace( ' ', '-', $caption_alignment );
	} else {
		// Standard left/center/right format
		$caption_alignment_class = 'caption-align-' . $caption_alignment;
	}
	$caption_classes[] = $caption_alignment_class;
}
$caption_class_attr = 'class="' . implode( ' ', $caption_classes ) . '"';
$caption_html       = $caption ? '<figcaption ' . $caption_class_attr . ' ' . $caption_style_attr . '>' . wp_kses_post( $caption ) . '</figcaption>' : '';
$id                 = isset( $media['id'] ) ? $media['id'] : '';

$aspect_ratio  = ! empty( $attributes['aspectRatio'] ) ? esc_attr( $attributes['aspectRatio'] ) : '';
$scale         = ! empty( $attributes['scale'] ) ? esc_attr( $attributes['scale'] ) : '';
$width         = isset( $attributes['width'] ) ? intval( $attributes['width'] ) : '';
$height        = isset( $attributes['height'] ) ? intval( $attributes['height'] ) : '';
$border        = $attributes['border'] ?? array();
$border_radius = ! empty( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : array();

// Use gallery-level border radius from context if the image has no border radius set
$effective_border_radius = empty( $border_radius ) && isset( $context['imagesBorderRadius'] ) ? $context['imagesBorderRadius'] : $border_radius;

$style = array(
	'border-top-left-radius'     => isset( $effective_border_radius['topLeft'] ) ? $effective_border_radius['topLeft'] : '',
	'border-top-right-radius'    => isset( $effective_border_radius['topRight'] ) ? $effective_border_radius['topRight'] : '',
	'border-bottom-left-radius'  => isset( $effective_border_radius['bottomLeft'] ) ? $effective_border_radius['bottomLeft'] : '',
	'border-bottom-right-radius' => isset( $effective_border_radius['bottomRight'] ) ? $effective_border_radius['bottomRight'] : '',
	'aspect-ratio'               => $aspect_ratio ? $aspect_ratio : '',
	'object-fit'                 => $scale ? $scale : '',
	'width'                      => $width ? "{$width}px" : '',
	'height'                     => $height ? "{$height}px" : '',
);

$wrapper_styles = array();

if ( isset( $context['layout'] ) && 'justified' === $context['layout'] ) {
	if ( isset( $context['justifiedRowHeight'] ) && $context['justifiedRowHeight'] ) {
		$style['height'] = intval( $context['justifiedRowHeight'] ) . 'px';
	}
} elseif ( isset( $context['layout'] ) && 'masonry' === $context['layout'] && isset( $context['blockSpacing'] ) && $context['blockSpacing'] ) {
	$block_gap                       = \Galleryberg\Helpers\Styling_Helpers::get_spacing_preset_css_var( $context['blockSpacing']['top'] ) ?? '16px';
	$wrapper_styles['margin-bottom'] = $block_gap;
}
$border_css = \Galleryberg\Helpers\Styling_Helpers::get_border_css_properties( $border );
$style      = array_merge( $style, $border_css );

$style_attr = ! empty( $style ) ? 'style="' . \Galleryberg\Helpers\Styling_Helpers::generate_css_string( $style ) . ';"' : '';

$classes = array(
	'wp-block-galleryberg-image',
	'galleryberg-image',
);

if ( ! empty( $align ) ) {
	$classes[] = 'galleryberg-image-' . $align;
}

if ( ! empty( $size_slug ) ) {
	$classes[] = 'size-' . $size_slug;
}

if ( ! empty( $width ) || ! empty( $height ) ) {
	$classes[] = 'is-resized';
}

$image_id = $id ? 'wp-image-' . esc_attr( $id ) : '';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $classes ),
		'id'    => $image_id,
		'style' => \Galleryberg\Helpers\Styling_Helpers::generate_css_string( $wrapper_styles ),
	)
);

$image_html = '';
if ( $id ) {
	$image_html = wp_get_attachment_image(
		$id,
		$size_slug ? $size_slug : 'full',
		false,
		array_merge(
			array(
				'alt'   => $img_alt,
				'style' => \Galleryberg\Helpers\Styling_Helpers::generate_css_string( $style ),
				'class' => trim( $image_classes ),
			),
			array() // Add more attributes if needed
		)
	);
}
?>
<figure <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<?php if ( $has_href ) : ?>
		<a href="<?php echo esc_url( $href ); ?>" <?php echo esc_attr( $link_class_attr ); ?> <?php echo esc_attr( $link_target_attr ); ?> <?php echo esc_attr( $new_rel_attr ); ?>>
			<?php echo wp_kses_post( $image_html ); ?>
		</a>
	<?php else : ?>
		<?php echo wp_kses_post( $image_html ); ?>
	<?php endif; ?>
	<?php echo wp_kses_post( $caption_html ); ?>
</figure>
