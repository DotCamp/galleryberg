/**
 * Wordpress Dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import { useMemo } from "react";
import {
	SelectControl,
	TextareaControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
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
import { BorderControl } from "../components";

function Inspector(props) {
	const { attributes, setAttributes } = props;
	const { alt, aspectRatio, height, scale, width, sizeSlug } = attributes;
	const resetAll = () => {
		setAttributes({
			alt: "",
			aspectRatio: "",
			height: "",
			scale: "cover",
			width: "",
		});
	};
	const scaleOptions = DEFAULT_SCALE_OPTIONS;
	const aspectRatioDisplayValue = aspectRatio ?? "auto";
	const scaleDisplayValue = scale ?? "cover";
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
					<ToolsPanelItem
						isShownByDefault
						label={__("Aspect ratio", "galleryberg-gallery-block")}
						onDeselect={() => setAttributes({ aspectRatio: "" })}
						hasValue={() =>
							aspectRatioDisplayValue !== aspectRatioOptions[0].value
						}
					>
						<SelectControl
							value={aspectRatioDisplayValue}
							__nextHasNoMarginBottom
							size={"__unstable-large"}
							options={aspectRatioOptions}
							label={__("Aspect ratio", "galleryberg-gallery-block")}
							onChange={(newValue) => setAttributes({ aspectRatio: newValue })}
						/>
					</ToolsPanelItem>
					{aspectRatio !== DEFAULT_ASPECT_RATIO_OPTIONS[0].value && (
						<ToolsPanelItem
							label={__("Scale", "galleryberg-gallery-block")}
							isShownByDefault
							hasValue={() => scaleDisplayValue !== scaleOptions[0].value}
							onDeselect={() => setAttributes({ scale: scaleOptions[0].value })}
						>
							<ToggleGroupControl
								label={__("Scale", "galleryberg-gallery-block")}
								isBlock
								help={scaleHelp[scaleDisplayValue]}
								value={scaleDisplayValue}
								onChange={(newScale) => setAttributes({ scale: newScale })}
								__nextHasNoMarginBottom
							>
								{scaleOptions.map((option) => (
									<ToggleGroupControlOption key={option.value} {...option} />
								))}
							</ToggleGroupControl>
						</ToolsPanelItem>
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
					<ToolsPanelItem
						isShownByDefault
						label={__("Resolution", "galleryberg-gallery-block")}
						hasValue={() => sizeSlug !== DEFAULT_SIZE_SLUG_OPTIONS[0].value}
						onDeselect={() =>
							setAttributes({
								sizeSlug: DEFAULT_SIZE_SLUG_OPTIONS[0].value,
							})
						}
					>
						<SelectControl
							label={__("Resolution", "galleryberg-gallery-block")}
							value={sizeSlug}
							options={DEFAULT_SIZE_SLUG_OPTIONS}
							onChange={(newSlug) => setAttributes({ sizeSlug: newSlug })}
							help={__(
								"Select the size of the source image.",
								"galleryberg-gallery-block",
							)}
							size={"__unstable-large"}
						/>
					</ToolsPanelItem>
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
		</>
	);
}

export default Inspector;
