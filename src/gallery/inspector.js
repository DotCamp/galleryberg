import { InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { defaultColumnsNumber } from "../utils";
import {
	BorderControl,
	ColorSettingsWithGradient,
	SpacingControl,
	SpacingControlWithToolsPanel,
} from "../components";

const MAX_COLUMNS = 8;

function Inspector(props) {
	const { attributes, setAttributes, images } = props;
	const {
		columns,
		lightbox,
		openEffect = "zoom",
		closeEffect = "zoom",
		slideEffect = "slide",
		keyboardNavigation = true,
		loop = true,
		zoomable = true,
		draggable = true,
		layout = "tiles",
		justifiedRowHeight = 180,
	} = attributes;
	function setColumnsNumber(value) {
		setAttributes({ columns: value });
	}

	function toggleLightbox() {
		setAttributes({ lightbox: !lightbox });
	}

	function setOpenEffect(value) {
		setAttributes({ openEffect: value });
	}
	function setCloseEffect(value) {
		setAttributes({ closeEffect: value });
	}
	function setSlideEffect(value) {
		setAttributes({ slideEffect: value });
	}
	function setKeyboardNavigation(val) {
		setAttributes({ keyboardNavigation: val });
	}
	function setLoop(val) {
		setAttributes({ loop: val });
	}
	function setZoomable(val) {
		setAttributes({ zoomable: val });
	}
	function setDraggable(val) {
		setAttributes({ draggable: val });
	}
	function setLayout(value) {
		setAttributes({ layout: value });
	}
	function setJustifiedRowHeight(value) {
		setAttributes({ justifiedRowHeight: value });
	}

	return (
		<>
			<InspectorControls group="color">
				<ColorSettingsWithGradient
					attrBackgroundKey="backgroundColor"
					attrGradientKey="backgroundGradient"
					label={__("Background", "galleryberg-gallery-block")}
				/>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<SpacingControlWithToolsPanel
					showByDefault
					sides={["all"]}
					attrKey="blockSpacing"
					label={__("Block Spacing", "ultimate-blocks")}
				/>
				<SpacingControlWithToolsPanel
					attrKey="padding"
					label={__("Padding", "ultimate-blocks")}
				/>
				<SpacingControlWithToolsPanel
					attrKey="margin"
					label={__("Margin", "ultimate-blocks")}
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
			</InspectorControls>
			<InspectorControls>
				<PanelBody title={__("Settings")}>
					<SelectControl
						label={__("Gallery Layout", "galleryberg-gallery-block")}
						value={layout}
						options={[
							{ label: "Tiles", value: "tiles" },
							{ label: "Masonry", value: "masonry" },
							{ label: "Justified", value: "justified" },
							{ label: "Square", value: "square" },
						]}
						onChange={setLayout}
					/>
					{layout === "justified" && (
						<RangeControl
							label={__("Row Height (px)", "galleryberg-gallery-block")}
							min={60}
							max={400}
							step={10}
							value={justifiedRowHeight}
							onChange={setJustifiedRowHeight}
						/>
					)}
					{layout !== "justified" && images.length > 1 && (
						<RangeControl
							__nextHasNoMarginBottom
							label={__("Columns", "galleryberg-gallery-block")}
							value={columns ? columns : defaultColumnsNumber(images.length)}
							onChange={setColumnsNumber}
							min={1}
							max={Math.min(MAX_COLUMNS, images.length)}
							required
							__next40pxDefaultSize
						/>
					)}
					<ToggleControl
						__nextHasNoMarginBottom
						label={__("Enable Lightbox", "galleryberg-gallery-block")}
						checked={!!lightbox}
						onChange={toggleLightbox}
					/>
					{lightbox && (
						<>
							<SelectControl
								label={__("Open Effect", "galleryberg-gallery-block")}
								value={openEffect}
								options={[
									{ label: "Zoom", value: "zoom" },
									{ label: "Fade", value: "fade" },
									{ label: "None", value: "none" },
								]}
								onChange={setOpenEffect}
							/>
							<SelectControl
								label={__("Close Effect", "galleryberg-gallery-block")}
								value={closeEffect}
								options={[
									{ label: "Zoom", value: "zoom" },
									{ label: "Fade", value: "fade" },
									{ label: "None", value: "none" },
								]}
								onChange={setCloseEffect}
							/>
							<SelectControl
								label={__("Slide Effect", "galleryberg-gallery-block")}
								value={slideEffect}
								options={[
									{ label: "Slide", value: "slide" },
									{ label: "Fade", value: "fade" },
									{ label: "Zoom", value: "zoom" },
									{ label: "None", value: "none" },
								]}
								onChange={setSlideEffect}
							/>
							<ToggleControl
								label={__("Keyboard Navigation", "galleryberg-gallery-block")}
								checked={!!keyboardNavigation}
								onChange={setKeyboardNavigation}
							/>
							<ToggleControl
								label={__("Loop", "galleryberg-gallery-block")}
								checked={!!loop}
								onChange={setLoop}
							/>
							<ToggleControl
								label={__("Zoomable", "galleryberg-gallery-block")}
								checked={!!zoomable}
								onChange={setZoomable}
							/>
							<ToggleControl
								label={__("Draggable", "galleryberg-gallery-block")}
								checked={!!draggable}
								onChange={setDraggable}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
		</>
	);
}
export default Inspector;
