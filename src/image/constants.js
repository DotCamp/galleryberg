import { __ } from "@wordpress/i18n";

export const DEFAULT_ASPECT_RATIO_OPTIONS = [
	{
		label: __("Original", "galleryberg-gallery-block"),
		value: "",
	},
	{
		label: __("Square - 1:1", "galleryberg-gallery-block"),
		value: "1",
	},
	{
		label: __("Standard - 4:3", "galleryberg-gallery-block"),
		value: "4/3",
	},
	{
		label: __("Portrait - 3:4", "galleryberg-gallery-block"),
		value: "3/4",
	},
	{
		label: __("Classic - 3:2", "galleryberg-gallery-block"),
		value: "3/2",
	},
	{
		label: __("Classic Portrait - 2:3", "galleryberg-gallery-block"),
		value: "2/3",
	},
	{
		label: __("Wide - 16:9", "galleryberg-gallery-block"),
		value: "16/9",
	},
	{
		label: __("Tall - 9:16", "galleryberg-gallery-block"),
		value: "9/16",
	},
];

export const DEFAULT_SCALE_OPTIONS = [
	{
		value: "cover",
		label: __("Cover", "galleryberg-gallery-block"),
		help: __("Fill the space by clipping what doesn't fit."),
	},
	{
		value: "contain",
		label: __("Contain", "galleryberg-gallery-block"),
		help: __("Fit the content to the space without clipping."),
	},
];

export const DEFAULT_SIZE_SLUG_OPTIONS = [
	{
		label: __("Thumbnail", "galleryberg-gallery-block"),
		value: "thumbnail",
	},
	{
		label: __("Medium", "galleryberg-gallery-block"),
		value: "medium",
	},
	{
		label: __("Large", "galleryberg-gallery-block"),
		value: "large",
	},
	{
		label: __("Full Size", "galleryberg-gallery-block"),
		value: "full",
	},
];
