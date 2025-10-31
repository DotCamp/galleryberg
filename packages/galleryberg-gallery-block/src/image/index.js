import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";
import edit from "./edit";
import { blockIcon } from "./block-icon";

import metadata from "./block.json";

registerBlockType(metadata, {
	icon: blockIcon,
	title: metadata.title,
	category: metadata.category,
	edit,
	save: () => null,
});
