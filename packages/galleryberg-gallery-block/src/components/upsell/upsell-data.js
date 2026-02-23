import { __ } from "@wordpress/i18n";

/**
 * Promo configuration — set these once to show a promo banner in every upsell modal.
 * Leave code/text empty to hide the promo.
 */
export const PROMO_CONFIG = {
	code: "GB20",
	text: "Use code to get a 20% discount.",
};

export const PRO_FEATURES = [
	{
		name: "lazy-loading",
		title: __("Lazy Loading", "galleryberg-gallery-block"),
		description: __(
			"Load images only when they enter the viewport for faster page loads and improved performance.",
			"galleryberg-gallery-block",
		),
	},
	{
		name: "mosaic-layout",
		title: __("Mosaic Layout", "galleryberg-gallery-block"),
		description: __(
			"Create stunning mosaic galleries with custom image span controls for unique, eye-catching layouts.",
			"galleryberg-gallery-block",
		),
	},
	{
		name: "lightbox-thumbnails",
		title: __("Lightbox Thumbnails", "galleryberg-gallery-block"),
		description: __(
			"Add thumbnail navigation to your lightbox for easier browsing. Includes customizable position, navigation style, and speed.",
			"galleryberg-gallery-block",
		),
	},
	{
		name: "mosaic-span",
		title: __("Mosaic Span Controls", "galleryberg-gallery-block"),
		description: __(
			"Control how many columns and rows each image spans in mosaic layout for fully customized gallery arrangements.",
			"galleryberg-gallery-block",
		),
	},
];

export function getFeatureInfo(featureKey) {
	return PRO_FEATURES.find((f) => f.name === featureKey);
}
