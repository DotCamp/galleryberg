import { __ } from "@wordpress/i18n";
import {
	ToggleControlWithToolsPanel,
	SelectControlWithToolsPanel,
	RangeControlWithToolsPanel,
} from "@galleryberg/shared";

function GalleryPro(props) {
	const { attributes, clientId, BlockEdit } = props;
	const {
		enableThumbnails,
		thumbnailPosition,
		thumbnailNavigation,
		thumbnailNavigationSpeed,
	} = attributes;

	const EnableThumbnails = (
		<ToggleControlWithToolsPanel
			label={__("Enable Thumbnails", "galleryberg-gallery-block-pro")}
			attrKey="enableThumbnails"
			defaultValue={false}
			help={__(
				"Show thumbnail navigation in lightbox",
				"galleryberg-gallery-block-pro"
			)}
		/>
	);
	const ThumbnailPosition = enableThumbnails && (
		<SelectControlWithToolsPanel
			label={__("Thumbnail Position", "galleryberg-gallery-block-pro")}
			attrKey="thumbnailPosition"
			options={[
				{
					label: __("Bottom", "galleryberg-gallery-block-pro"),
					value: "bottom",
				},
				{
					label: __("Top", "galleryberg-gallery-block-pro"),
					value: "top",
				},
				{
					label: __("Left", "galleryberg-gallery-block-pro"),
					value: "left",
				},
				{
					label: __("Right", "galleryberg-gallery-block-pro"),
					value: "right",
				},
			]}
			defaultValue="bottom"
		/>
	);
	const ThumbnailNavigation = enableThumbnails && (
		<SelectControlWithToolsPanel
			label={__("Thumbnail Navigation", "galleryberg-gallery-block-pro")}
			attrKey="thumbnailNavigation"
			options={[
				{
					label: __("Direct (Instant)", "galleryberg-gallery-block-pro"),
					value: "direct",
				},
				{
					label: __("Step by Step", "galleryberg-gallery-block-pro"),
					value: "step",
				},
			]}
			defaultValue="direct"
			help={__(
				"Choose how clicking a thumbnail navigates to that image",
				"galleryberg-gallery-block-pro"
			)}
		/>
	);
	const ThumbnailNavigationSpeed =
		enableThumbnails && thumbnailNavigation === "step" && (
			<RangeControlWithToolsPanel
				label={__("Navigation Speed", "galleryberg-gallery-block-pro")}
				attrKey="thumbnailNavigationSpeed"
				min={5}
				max={300}
				step={5}
				defaultValue={10}
				help={__(
					"Milliseconds between each step (lower = faster)",
					"galleryberg-gallery-block-pro"
				)}
			/>
		);
	const proProps = {
		...props,
		EnableThumbnails,
		ThumbnailPosition,
		ThumbnailNavigation,
		ThumbnailNavigationSpeed,
		enableThumbnails,
		thumbnailPosition,
		thumbnailNavigation,
		thumbnailNavigationSpeed,
	};
	return (
		<>
			<BlockEdit {...proProps} />
		</>
	);
}

export default GalleryPro;
