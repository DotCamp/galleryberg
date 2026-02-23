/**
 * Wordpress Dependencies
 */
import { InspectorControls } from "@wordpress/block-editor";
import { useMemo } from "react";
import {
	Tip,
	TextareaControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
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
	SelectControlWithToolsPanel,
	ToggleGroupControlWithToolsPanel,
} from "@galleryberg/shared";
import { upsellIcon } from "../../assets/upsell-icon.js";
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
			captionType: "",
			captionVisibility: "",
			captionAlignment: "",
			captionColor: "",
			captionBackgroundColor: "",
			captionBackgroundGradient: "",
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
					panelId={clientId}
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
						defaultValue=""
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
						defaultValue=""
					/>

					{(!attributes.captionType || attributes.captionType === "below") && (
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
				</ToolsPanel>
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

			<InspectorControls>
				<PanelBody
					title={__("Galleryberg PRO", "galleryberg-gallery-block")}
					icon={upsellIcon}
					initialOpen={true}
				>
					{isPro ? (
						<>
							<p
								style={{
									fontSize: "14px",
									fontWeight: "600",
									margin: "0 0 12px 0",
									color: "#1e1e1e",
								}}
							>
								{__("✅ You're a Pro User!", "galleryberg-gallery-block")}
							</p>
							<ul
								style={{
									listStyle: "none",
									padding: 0,
									margin: "0 0 16px 0",
									display: "grid",
									gap: "10px",
								}}
							>
								<li>
									<a
										href="https://galleryberg.com/contact/"
										target="_blank"
										rel="noopener noreferrer"
										style={{
											textDecoration: "none",
											color: "#1e1e1e",
											fontWeight: "500",
										}}
									>
										{__("🛟 Priority Support", "galleryberg-gallery-block")}
									</a>
								</li>
								<li>
									<a
										href="https://galleryberg.com/docs/"
										target="_blank"
										rel="noopener noreferrer"
										style={{
											textDecoration: "none",
											color: "#1e1e1e",
											fontWeight: "500",
										}}
									>
										{__("📔 Documentation", "galleryberg-gallery-block")}
									</a>
								</li>
								<li>
									<a
										href="http://galleryberg.com/request-a-feature/"
										target="_blank"
										rel="noopener noreferrer"
										style={{
											textDecoration: "none",
											color: "#1e1e1e",
											fontWeight: "500",
										}}
									>
										{__("💡 Request a Feature", "galleryberg-gallery-block")}
									</a>
								</li>
							</ul>
							<hr style={{ border: 0, borderTop: "1px solid #e5e7eb" }} />
							<div style={{ marginTop: "12px" }}>
								<a
									href="https://galleryberg.com/pricing/"
									target="_blank"
									rel="noopener noreferrer"
									style={{
										textDecoration: "none",
										color: "#1e1e1e",
										fontWeight: "600",
									}}
								>
									{__("📦 Get WP Block Suite", "galleryberg-gallery-block")}
								</a>
							</div>
						</>
					) : (
						<>
							<h3
								style={{
									fontSize: "14px",
									fontWeight: "600",
									margin: "0 0 8px 0",
									color: "#1e1e1e",
									letterSpacing: "0.5px",
								}}
							>
								{__(
									"GET GALLERYBERG PRO - EARLY BIRD DEAL",
									"galleryberg-gallery-block",
								)}
							</h3>
							<p
								style={{
									fontSize: "13px",
									color: "#757575",
									margin: "0 0 16px 0",
									lineHeight: "1.5",
								}}
							>
								{__(
									"Unlock advanced layouts, lightbox thumbnails, and more.",
									"galleryberg-gallery-block",
								)}
							</p>
							<a
								href="http://galleryberg.com/pricing/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "block",
									width: "100%",
									padding: "12px 24px",
									background: "#4c6ef5",
									color: "#fff",
									borderRadius: "4px",
									textDecoration: "none",
									fontWeight: "500",
									fontSize: "14px",
									textAlign: "center",
									border: "none",
									cursor: "pointer",
								}}
							>
								{__("Get Lifetime Access - $49", "galleryberg-gallery-block")}
							</a>
							<div
								style={{
									marginTop: "10px",
									fontSize: "12px",
									color: "#6b7280",
									textAlign: "center",
								}}
							>
								<a
									href="https://galleryberg.com/docs/"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "inherit", textDecoration: "none" }}
								>
									{__("Docs", "galleryberg-gallery-block")}
								</a>
								<span> | </span>
								<a
									href="https://wordpress.org/support/plugin/galleryberg-gallery-block/"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "inherit", textDecoration: "none" }}
								>
									{__("Support", "galleryberg-gallery-block")}
								</a>
								<span> | </span>
								<a
									href="http://galleryberg.com/request-a-feature/"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "inherit", textDecoration: "none" }}
								>
									{__("Request a Feature", "galleryberg-gallery-block")}
								</a>
							</div>
						</>
					)}
				</PanelBody>
			</InspectorControls>
		</>
	);
}
export default Inspector;
