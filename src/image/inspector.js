/**
 * Wordpress Dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import { useMemo } from "react";
import {
	TextareaControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
/***
 * Internal imports
 */
import {
	DEFAULT_ASPECT_RATIO_OPTIONS,
	DEFAULT_SCALE_OPTIONS,
	DEFAULT_SIZE_SLUG_OPTIONS,
} from "./constants";
import {
	BorderControl,
	ColorSettings,
	SelectControlWithToolsPanel,
	ToggleGroupControlWithToolsPanel,
} from "../components";

function Inspector({ attributes, setAttributes }) {
	const { alt, aspectRatio, height, scale, width } = attributes;
	const resetAll = () => {
		setAttributes({
			alt: "",
			aspectRatio: "",
			height: "",
			scale: "cover",
			width: "",
		});
	};
	const resetCaptionSettings = () => {
		setAttributes({
			captionType: "below",
			captionVisibility: "always",
			captionAlignment: "left",
			captionColor: "",
			captionBackgroundColor: "",
		});
	};
	const scaleOptions = DEFAULT_SCALE_OPTIONS;
	const scaleHelp = useMemo(() => {
		return scaleOptions.reduce((acc, option) => {
			acc[option.value] = option.help;
			return acc;
		}, {});
	}, [scaleOptions]);
	const aspectRatioOptions = DEFAULT_ASPECT_RATIO_OPTIONS;

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={__("Settings", "galleryberg-gallery-block")}
					resetAll={resetAll}
				>
					<ToolsPanelItem
						isShownByDefault
						hasValue={() => !!alt}
						label={__("Alternative Text", "galleryberg-gallery-block")}
						onDeselect={() => setAttributes({ alt: "" })}
					>
						<TextareaControl
							__nextHasNoMarginBottom
							value={alt}
							label={__("Alternative Text", "galleryberg-gallery-block")}
							onChange={(newValue) => setAttributes({ alt: newValue })}
						/>
					</ToolsPanelItem>
					<SelectControlWithToolsPanel
						label={__("Aspect ratio", "galleryberg-gallery-block")}
						attrKey="aspectRatio"
						options={aspectRatioOptions}
						defaultValue="auto"
					/>
					{aspectRatio !== DEFAULT_ASPECT_RATIO_OPTIONS[0].value && (
						<ToggleGroupControlWithToolsPanel
							label={__("Scale", "galleryberg-gallery-block")}
							attrKey="scale"
							options={scaleOptions}
							help={scaleHelp[scale ?? "cover"]}
							defaultValue={scaleOptions[0].value}
						/>
					)}
					<div className="galleryberg-width-height-control">
						<ToolsPanelItem
							isShownByDefault
							label={__("Width", "galleryberg-gallery-block")}
							hasValue={() => width !== ""}
							onDeselect={() => setAttributes({ width: "" })}
						>
							<UnitControl
								label={__("Width", "galleryberg-gallery-block")}
								placeholder={__("Auto", "galleryberg-gallery-block")}
								labelPosition="top"
								units={[{ value: "px", label: "px", default: 0 }]}
								min={0}
								value={width}
								onChange={(newWidth) => setAttributes({ width: newWidth })}
								size={"__unstable-large"}
							/>
						</ToolsPanelItem>
						<ToolsPanelItem
							isShownByDefault
							label={__("height", "galleryberg-gallery-block")}
							hasValue={() => height !== ""}
							onDeselect={() => setAttributes({ height: "" })}
						>
							<UnitControl
								label={__("Height", "galleryberg-gallery-block")}
								placeholder={__("Auto", "galleryberg-gallery-block")}
								labelPosition="top"
								units={[{ value: "px", label: "px", default: 0 }]}
								min={0}
								value={height}
								onChange={(newHeight) => setAttributes({ height: newHeight })}
								size={"__unstable-large"}
							/>
						</ToolsPanelItem>
					</div>
					<SelectControlWithToolsPanel
						label={__("Resolution", "galleryberg-gallery-block")}
						attrKey="sizeSlug"
						options={DEFAULT_SIZE_SLUG_OPTIONS}
						defaultValue={DEFAULT_SIZE_SLUG_OPTIONS[0].value}
						help={__(
							"Select the size of the source image.",
							"galleryberg-gallery-block",
						)}
					/>
				</ToolsPanel>
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
				<ToolsPanel
					label={__("Caption Settings", "galleryberg-gallery-block")}
					resetAll={resetCaptionSettings}
				>
					<SelectControlWithToolsPanel
						label={__("Caption Type", "galleryberg-gallery-block")}
						attrKey="captionType"
						options={[
							{
								label: __("Select Caption Type", "galleryberg-gallery-block"),
								value: "",
							},
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
					/>

					<SelectControlWithToolsPanel
						label={__("Caption Visibility", "galleryberg-gallery-block")}
						attrKey="captionVisibility"
						options={[
							{
								label: __(
									"Select Caption Visibility",
									"galleryberg-gallery-block",
								),
								value: "",
							},
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
					/>

					<ToggleGroupControlWithToolsPanel
						label={__("Caption Alignment", "galleryberg-gallery-block")}
						attrKey="captionAlignment"
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
					/>
				</ToolsPanel>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorSettings
					label={__("Caption Color", "galleryberg-gallery-block")}
					attrKey="captionColor"
				/>
				<ColorSettings
					label={__("Caption Background", "galleryberg-gallery-block")}
					attrKey="captionBackgroundColor"
				/>
			</InspectorControls>
		</>
	);
}

export default Inspector;
