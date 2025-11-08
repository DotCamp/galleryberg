import { InspectorControls } from "@wordpress/block-editor";
import {
	Tip,
	__experimentalToolsPanel as ToolsPanel,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
	BorderControl,
	ColorSettingsWithGradient,
	SpacingControlWithToolsPanel,
	ColorSettings,
	SelectControlWithToolsPanel,
	RangeControlWithToolsPanel,
	ToggleControlWithToolsPanel,
	ToggleGroupControlWithToolsPanel,
} from "@galleryberg/shared";

const MAX_COLUMNS = 8;

function Inspector(props) {
	const {
		attributes,
		setAttributes,
		images,
		EnableThumbnails = null,
		ThumbnailPosition = null,
		ThumbnailNavigation = null,
		ThumbnailNavigationSpeed = null,
		proLayouts = [],
	} = props;
	const {
		lightbox,
		layout = "tiles",
		enableHoverEffect,
		enableThumbnails = "",
		thumbnailPosition = "",
		thumbnailNavigation = "",
		thumbnailNavigationSpeed = "",
	} = attributes;

	function resetSettings() {
		const attributesToReset = {
			layout: "tiles",
			columns: undefined,
			justifiedRowHeight: 180,
			enableHoverEffect: false,
			hoverEffect: "zoom-in",
			lightbox: false,
			openEffect: "zoom",
			closeEffect: "zoom",
			slideEffect: "slide",
			keyboardNavigation: true,
			loop: true,
			zoomable: true,
			draggable: true,
		};
		if (enableThumbnails) {
			attributesToReset.enableThumbnails = false;
		}
		if (thumbnailPosition) {
			attributesToReset.thumbnailPosition = "bottom";
		}
		if (thumbnailNavigation) {
			attributesToReset.thumbnailNavigation = "direct";
		}
		if (thumbnailNavigationSpeed) {
			attributesToReset.thumbnailNavigationSpeed = 10;
		}
		setAttributes(attributesToReset);
	}

	function resetCaptionSettings() {
		setAttributes({
			galleryCaptionType: "below",
			galleryCaptionVisibility: "always",
			galleryCaptionAlignment: "left",
			galleryCaptionColor: "",
			galleryCaptionBackgroundColor: "",
		});
	}

	return (
		<>
			<InspectorControls group="color">
				<ColorSettingsWithGradient
					attrBackgroundKey="backgroundColor"
					attrGradientKey="backgroundGradient"
					label={__("Background", "galleryberg-gallery-block")}
				/>
				<ColorSettings
					label={__("Caption Color", "galleryberg-gallery-block")}
					attrKey="galleryCaptionColor"
				/>
				<ColorSettings
					label={__("Caption Background", "galleryberg-gallery-block")}
					attrKey="galleryCaptionBackgroundColor"
				/>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<SpacingControlWithToolsPanel
					showByDefault
					sides={["horizontal", "vertical"]}
					attrKey="blockSpacing"
					label={__("Block Spacing", "galleryberg-gallery-block")}
				/>
				<SpacingControlWithToolsPanel
					attrKey="padding"
					label={__("Padding", "galleryberg-gallery-block")}
				/>
				<SpacingControlWithToolsPanel
					attrKey="margin"
					label={__("Margin", "galleryberg-gallery-block")}
				/>
			</InspectorControls>
			<InspectorControls group="border">
				<BorderControl
					showDefaultBorder
					showDefaultBorderRadius
					attrBorderKey="border"
					attrBorderRadiusKey="borderRadius"
					borderLabel={__("Border", "galleryberg-gallery-block")}
					borderRadiusLabel={__("Border Radius", "galleryberg-gallery-block")}
				/>
				<BorderControl
					isShowBorder={false}
					showDefaultBorderRadius
					attrBorderRadiusKey="imagesBorderRadius"
					borderRadiusLabel={__(
						"Images Border Radius",
						"galleryberg-gallery-block"
					)}
				/>
			</InspectorControls>
			<InspectorControls>
				<ToolsPanel
					panelId={props.clientId}
					label={__("Settings", "galleryberg-gallery-block")}
					resetAll={resetSettings}
				>
					<SelectControlWithToolsPanel
						label={__("Gallery Layout", "galleryberg-gallery-block")}
						attrKey="layout"
						options={[
							{ label: "Tiles", value: "tiles" },
							{ label: "Masonry", value: "masonry" },
							{ label: "Justified", value: "justified" },
							{ label: "Square", value: "square" },
							...proLayouts,
						]}
						defaultValue="tiles"
					/>
					{layout === "justified" && (
						<RangeControlWithToolsPanel
							label={__("Row Height (px)", "galleryberg-gallery-block")}
							attrKey="justifiedRowHeight"
							min={60}
							max={400}
							step={10}
							defaultValue={180}
						/>
					)}
					{layout !== "justified" && images.length > 1 && (
						<RangeControlWithToolsPanel
							label={__("Columns", "galleryberg-gallery-block")}
							attrKey="columns"
							min={1}
							max={Math.min(MAX_COLUMNS, images.length)}
							required={true}
							defaultValue={undefined}
						/>
					)}
					<ToggleControlWithToolsPanel
						label={__("Enable Hover Effect", "galleryberg-gallery-block")}
						attrKey="enableHoverEffect"
						defaultValue={false}
					/>
					{enableHoverEffect && (
						<SelectControlWithToolsPanel
							label={__("Hover Effect", "galleryberg-gallery-block")}
							attrKey="hoverEffect"
							options={[
								{
									label: __("Zoom In", "galleryberg-gallery-block"),
									value: "zoom-in",
								},
								{
									label: __("Zoom Out", "galleryberg-gallery-block"),
									value: "zoom-out",
								},
							]}
							defaultValue="zoom-in"
						/>
					)}
					<ToggleControlWithToolsPanel
						label={__("Enable Lightbox", "galleryberg-gallery-block")}
						attrKey="lightbox"
						defaultValue={false}
					/>
					{lightbox && (
						<>
							<SelectControlWithToolsPanel
								label={__("Open Effect", "galleryberg-gallery-block")}
								attrKey="openEffect"
								options={[
									{ label: "Zoom", value: "zoom" },
									{ label: "Fade", value: "fade" },
									{ label: "None", value: "none" },
								]}
								defaultValue="zoom"
							/>
							<SelectControlWithToolsPanel
								label={__("Close Effect", "galleryberg-gallery-block")}
								attrKey="closeEffect"
								options={[
									{ label: "Zoom", value: "zoom" },
									{ label: "Fade", value: "fade" },
									{ label: "None", value: "none" },
								]}
								defaultValue="zoom"
							/>
							<SelectControlWithToolsPanel
								label={__("Slide Effect", "galleryberg-gallery-block")}
								attrKey="slideEffect"
								options={[
									{ label: "Slide", value: "slide" },
									{ label: "Fade", value: "fade" },
									{ label: "Zoom", value: "zoom" },
									{ label: "None", value: "none" },
								]}
								defaultValue="slide"
							/>
							<ToggleControlWithToolsPanel
								label={__("Keyboard Navigation", "galleryberg-gallery-block")}
								attrKey="keyboardNavigation"
								defaultValue={true}
							/>
							<ToggleControlWithToolsPanel
								label={__("Loop", "galleryberg-gallery-block")}
								attrKey="loop"
								defaultValue={true}
							/>
							<ToggleControlWithToolsPanel
								label={__("Zoomable", "galleryberg-gallery-block")}
								attrKey="zoomable"
								defaultValue={true}
							/>
							<ToggleControlWithToolsPanel
								label={__("Draggable", "galleryberg-gallery-block")}
								attrKey="draggable"
								defaultValue={true}
							/>
							{EnableThumbnails && EnableThumbnails}
							{ThumbnailPosition && ThumbnailPosition}
							{ThumbnailNavigation && ThumbnailNavigation}
							{ThumbnailNavigationSpeed && ThumbnailNavigationSpeed}
						</>
					)}
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls>
				<ToolsPanel
					panelId={props.clientId}
					label={__("Caption Settings", "galleryberg-gallery-block")}
					resetAll={resetCaptionSettings}
				>
					<SelectControlWithToolsPanel
						label={__("Caption Type", "galleryberg-gallery-block")}
						attrKey="galleryCaptionType"
						options={[
							{
								label: __("Below Image", "galleryberg-gallery-block"),
								value: "below",
							},
							{
								label: __("Full Overlay", "galleryberg-gallery-block"),
								value: "full-overlay",
							},
							{
								label: __("Bar Overlay", "galleryberg-gallery-block"),
								value: "bar-overlay",
							},
						]}
						defaultValue="below"
						help={__(
							"Apply caption type to all images in the gallery",
							"galleryberg-gallery-block"
						)}
					/>

					<SelectControlWithToolsPanel
						label={__("Caption Visibility", "galleryberg-gallery-block")}
						attrKey="galleryCaptionVisibility"
						options={[
							{
								label: __("Always Visible", "galleryberg-gallery-block"),
								value: "always",
							},
							{
								label: __("Show on Hover", "galleryberg-gallery-block"),
								value: "show-on-hover",
							},
							{
								label: __("Hide on Hover", "galleryberg-gallery-block"),
								value: "hide-on-hover",
							},
						]}
						defaultValue="always"
						help={__(
							"Apply caption visibility to all images in the gallery",
							"galleryberg-gallery-block"
						)}
					/>

					{attributes.galleryCaptionType === "below" && (
						<ToggleGroupControlWithToolsPanel
							label={__("Caption Alignment", "galleryberg-gallery-block")}
							attrKey="galleryCaptionAlignment"
							options={[
								{
									label: __("Left", "galleryberg-gallery-block"),
									value: "left",
								},
								{
									label: __("Center", "galleryberg-gallery-block"),
									value: "center",
								},
								{
									label: __("Right", "galleryberg-gallery-block"),
									value: "right",
								},
							]}
							defaultValue="left"
							help={__(
								"Apply caption alignment to all images in the gallery",
								"galleryberg-gallery-block"
							)}
						/>
					)}
					{(attributes.galleryCaptionType === "full-overlay" ||
						attributes.galleryCaptionType === "bar-overlay") && (
						<div style={{ gridColumn: "1 / -1" }}>
							<Tip>
								{__(
									"Use the alignment matrix control in the toolbar to position overlay captions",
									"galleryberg-gallery-block"
								)}
							</Tip>
						</div>
					)}
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
export default Inspector;
