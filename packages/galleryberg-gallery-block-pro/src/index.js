import { createHigherOrderComponent } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import { addFilter } from "@wordpress/hooks";
import GalleryPro from "./gallery";
import ImagePro from "./image";

/**
 * Add pro attributes to gallery and image blocks
 */
function addProAttributes(settings, name) {
	if (name !== "galleryberg/gallery" && name !== "galleryberg/image") {
		return settings;
	}

	if (name === "galleryberg/gallery") {
		return {
			...settings,
			attributes: {
				...settings.attributes,
				// Lazy loading
				enableLazyLoading: {
					type: "boolean",
					default: false,
				},
				// Thumbnail settings
				enableThumbnails: {
					type: "boolean",
					default: false,
				},
				thumbnailPosition: {
					type: "string",
					default: "bottom",
				},
				thumbnailNavigation: {
					type: "string",
					default: "direct", // 'direct' or 'step'
				},
				thumbnailNavigationSpeed: {
					type: "number",
					default: 10, // milliseconds between steps
				},
			},
			providesContext: {
				...settings.providesContext,
				"galleryberg/enableLazyLoading": "enableLazyLoading",
				"galleryberg/enableThumbnails": "enableThumbnails",
				"galleryberg/thumbnailPosition": "thumbnailPosition",
				"galleryberg/thumbnailNavigation": "thumbnailNavigation",
				"galleryberg/thumbnailNavigationSpeed": "thumbnailNavigationSpeed",
			},
		};
	}

	if (name === "galleryberg/image") {
		return {
			...settings,
			attributes: {
				...settings.attributes,
				// Lazy loading
				enableLazyLoading: {
					type: "boolean",
					default: false,
				},
				// Mosaic span settings
				mosaicSpanX: {
					type: "number",
					default: 1,
				},
				mosaicSpanY: {
					type: "number",
					default: 1,
				},
			},
		};
	}

	return settings;
}

addFilter(
	"blocks.registerBlockType",
	"galleryberg-pro/add-pro-attributes",
	addProAttributes
);

const BlockNameToComponentMapping = {
	"galleryberg/gallery": GalleryPro,
	"galleryberg/image": ImagePro,
};

/**
 * Add pro controls to gallery inspector
 */
const withProInspectorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const targetBlockName = props.name;

		if (Object.keys(BlockNameToComponentMapping).indexOf(targetBlockName) < 0) {
			return <BlockEdit {...props} />;
		}

		const ExtensionBlock = BlockNameToComponentMapping[targetBlockName];

		return <ExtensionBlock {...props} BlockEdit={BlockEdit} />;
	};
}, "withProInspectorControls");

addFilter(
	"editor.BlockEdit",
	"galleryberg-pro/with-pro-inspector-controls",
	withProInspectorControls
);
