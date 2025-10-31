import { registerBlockType, createBlock } from "@wordpress/blocks";

import "./style.scss";
import { blockIcon } from "./block-icon";

/**
 * Internal dependencies
 */
import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

const transformFromCoreGallery = (attributes, innerBlocks) => {
	const { images = [], columns = 3, imageCrop = true } = attributes;
	const updatedInnerBlocks = innerBlocks.map((image) =>
		createBlock("galleryberg/image", {
			media: {
				id: image.attributes.id,
				url: image.attributes.url,
				alt: image.attributes.alt,
				caption: image.attributes.caption,
			},
			href: image.attributes.href,
			linkDestination: image.attributes.linkDestination,
			linkTarget: image.attributes.linkTarget,
			linkClass: image.attributes.linkClass,
			rel: image.attributes.rel,
			align: image.attributes.align,
			width: image.attributes.width,
			height: image.attributes.height,
			sizeSlug: image.attributes.sizeSlug,
			aspectRatio: image.attributes.aspectRatio,
			scale: image.attributes.scale,
			border: image.attributes?.style?.border
				? (() => {
						const border = { ...image.attributes.style.border };
						delete border.radius;
						return border;
				  })()
				: {},
			borderRadius: image.attributes?.style?.border?.radius
				? typeof image.attributes?.style?.border?.radius === "string"
					? {
							topLeft: image.attributes?.style?.border?.radius,
							topRight: image.attributes?.style?.border?.radius,
							bottomLeft: image.attributes?.style?.border?.radius,
							bottomRight: image.attributes?.style?.border?.radius,
					  }
					: image.attributes?.style?.border?.radius
				: {},
			margin: image.attributes?.style?.spacing?.margin,
		})
	);

	return createBlock(
		"galleryberg/gallery",
		{
			columns,
			cropImages: imageCrop,
			border: attributes?.style?.border
				? (() => {
						const border = { ...attributes.style.border };
						delete border.radius;
						return border;
				  })()
				: {},
			borderRadius: attributes?.style?.border?.radius
				? typeof attributes?.style?.border?.radius === "string"
					? {
							topLeft: attributes?.style?.border?.radius,
							topRight: attributes?.style?.border?.radius,
							bottomLeft: attributes?.style?.border?.radius,
							bottomRight: attributes?.style?.border?.radius,
					  }
					: attributes?.style?.border?.radius
				: {},
			margin: attributes?.style?.spacing?.margin,
			padding: attributes?.style?.spacing?.padding,
			blockSpacing: attributes?.style?.spacing?.blockGap,
		},
		updatedInnerBlocks
	);
};

registerBlockType(metadata.name, {
	icon: blockIcon,
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
	transforms: {
		from: [
			{
				type: "block",
				blocks: ["core/gallery"],
				transform: transformFromCoreGallery,
			},
		],
	},
});
