/**
 * Wordpress Dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import { useMemo } from "react";
import {
	Tip,
	TextareaControl,
	__experimentalUnitControl as UnitControl,
	FocalPointPicker,
	PanelBody,
	ToggleControl,
	RangeControl,
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
	ColorSettingsWithGradient,
	SelectControlWithoutToolsPanel,
	ToggleGroupControlWithoutToolsPanel,
} from "@galleryberg/shared";
import LockedControl from "../components/upsell/LockedControl";

function Inspector({
	attributes,
	setAttributes,
	clientId,
	MosaicSpanX = null,
	MosaicSpanY = null,
	EnableLazyLoading = null,
	isPro = false,
}) {
	const { alt, aspectRatio, focalPoint, height, media, scale, width } = attributes;
	const focalPointUrl = media?.sizes?.large?.url ?? media?.url ?? "";
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
				<PanelBody
					title={__("Settings", "galleryberg-gallery-block")}
					initialOpen={false}
				>
					<TextareaControl
						__nextHasNoMarginBottom
						value={alt}
						label={__("Alternative Text", "galleryberg-gallery-block")}
						onChange={(newValue) => setAttributes({ alt: newValue })}
					/>
					{focalPointUrl && (
						<FocalPointPicker
							__nextHasNoMarginBottom
							label={__("Focal Point", "galleryberg-gallery-block")}
							url={focalPointUrl}
							value={focalPoint}
							onChange={(newFocalPoint) =>
								setAttributes({ focalPoint: newFocalPoint })
							}
						/>
					)}
					<SelectControlWithoutToolsPanel
						label={__("Aspect ratio", "galleryberg-gallery-block")}
						attrKey="aspectRatio"
						options={aspectRatioOptions}
						defaultValue="auto"
					/>
					{aspectRatio !== DEFAULT_ASPECT_RATIO_OPTIONS[0].value && (
						<ToggleGroupControlWithoutToolsPanel
							label={__("Scale", "galleryberg-gallery-block")}
							attrKey="scale"
							options={scaleOptions}
							help={scaleHelp[scale ?? "cover"]}
							defaultValue={scaleOptions[0].value}
						/>
					)}
					<div className="galleryberg-width-height-control">
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
					</div>
					<SelectControlWithoutToolsPanel
						label={__("Resolution", "galleryberg-gallery-block")}
						attrKey="sizeSlug"
						options={DEFAULT_SIZE_SLUG_OPTIONS}
						defaultValue={DEFAULT_SIZE_SLUG_OPTIONS[0].value}
						help={__(
							"Select the size of the source image.",
							"galleryberg-gallery-block",
						)}
					/>
					{EnableLazyLoading && EnableLazyLoading}
					{MosaicSpanX && MosaicSpanX}
					{MosaicSpanY && MosaicSpanY}
					{!EnableLazyLoading && !isPro && (
						<LockedControl featureKey="lazy-loading">
							<ToggleControl
								label={__("Enable Lazy Loading", "galleryberg-gallery-block")}
								checked={false}
								__nextHasNoMarginBottom
							/>
						</LockedControl>
					)}
					{!MosaicSpanX && !isPro && (
						<LockedControl featureKey="mosaic-span">
							<RangeControl
								label={__("Mosaic Column Span", "galleryberg-gallery-block")}
								value={1}
								min={1}
								max={5}
								__nextHasNoMarginBottom
							/>
						</LockedControl>
					)}
				</PanelBody>
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
				<PanelBody
					title={__("Caption Settings", "galleryberg-gallery-block")}
					initialOpen={false}
				>
					<SelectControlWithoutToolsPanel
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
						defaultValue=""
						onAfterChange={(newValue) => {
							if (newValue === "below") {
								setAttributes({
									captionBackgroundColor: null,
									captionBackgroundGradient: null,
								});
							}
						}}
					/>

					<SelectControlWithoutToolsPanel
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
						defaultValue=""
					/>

					{(!attributes.captionType || attributes.captionType === "below") && (
						<ToggleGroupControlWithoutToolsPanel
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
							defaultValue=""
						/>
					)}
					{(attributes.captionType === "full-overlay" ||
						attributes.captionType === "bar-overlay") && (
						<div style={{ gridColumn: "1 / -1" }}>
							<Tip>
								{__(
									"Use the alignment matrix control in the toolbar to position overlay captions",
									"galleryberg-gallery-block",
								)}
							</Tip>
						</div>
					)}
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="color">
				<ColorSettings
					label={__("Caption Color", "galleryberg-gallery-block")}
					attrKey="captionColor"
				/>
				<ColorSettingsWithGradient
					attrBackgroundKey="captionBackgroundColor"
					attrGradientKey="captionBackgroundGradient"
					label={__("Caption Background", "galleryberg-gallery-block")}
				/>
			</InspectorControls>

		</>
	);
}
export default Inspector;
