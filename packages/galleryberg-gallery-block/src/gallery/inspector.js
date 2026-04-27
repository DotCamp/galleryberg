import { InspectorControls } from "@wordpress/block-editor";
import {
	Tip,
	PanelBody,
	Button,
	ToggleControl,
	SelectControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { desktop, tablet, mobile } from "@wordpress/icons";
import {
	BorderControl,
	ColorSettingsWithGradient,
	SpacingControlWithToolsPanel,
	ColorSettings,
	SelectControlWithoutToolsPanel,
	RangeControlWithoutToolsPanel,
	ToggleControlWithoutToolsPanel,
	ToggleGroupControlWithoutToolsPanel,
} from "@galleryberg/shared";

import { upsellIcon } from "../../assets/upsell-icon.js";
import LockedControl from "../components/upsell/LockedControl";

const MAX_COLUMNS = 8;

function Inspector(props) {
	const {
		attributes,
		setAttributes,
		images,
		EnableThumbnails = null,
		EnableLazyLoading = null,
		ThumbnailPosition = null,
		ThumbnailNavigation = null,
		ThumbnailNavigationSpeed = null,
		proLayouts = [],
		isPro = false,
		selectedDevice,
		handleDeviceChange,
	} = props;
	const {
		lightbox,
		layout = "tiles",
		enableHoverEffect,
		enableLazyLoading = "",
		enableThumbnails = "",
		thumbnailPosition = "",
		thumbnailNavigation = "",
		thumbnailNavigationSpeed = "",
	} = attributes;

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
				<ColorSettingsWithGradient
					attrBackgroundKey="galleryCaptionBackgroundColor"
					attrGradientKey="galleryCaptionBackgroundGradient"
					label={__("Caption Background", "galleryberg-gallery-block")}
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
						"galleryberg-gallery-block",
					)}
				/>
			</InspectorControls>
			<InspectorControls>
				<PanelBody
					title={__("Settings", "galleryberg-gallery-block")}
					initialOpen={false}
				>
					<SelectControlWithoutToolsPanel
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
					{proLayouts.length === 0 && !isPro && (
						<LockedControl featureKey="mosaic-layout">
							<SelectControl
								label={__("Gallery Layout", "galleryberg-gallery-block")}
								value="mosaic"
								options={[{ label: "Mosaic", value: "mosaic" }]}
								size="__unstable-large"
								__nextHasNoMarginBottom
							/>
						</LockedControl>
					)}
					<br />
					{layout === "justified" && (
						<RangeControlWithoutToolsPanel
							label={__("Row Height (px)", "galleryberg-gallery-block")}
							attrKey="justifiedRowHeight"
							min={60}
							max={400}
							step={10}
							defaultValue={180}
						/>
					)}
					{layout !== "justified" && images.length > 1 && (
						<>
							<div className="galleryberg-gallery-columns">
								<div
									style={{
										display: "flex",
										gap: "4px",
									}}
								>
									<Button
										icon={desktop}
										isPressed={selectedDevice === "desktop"}
										onClick={() => handleDeviceChange("Desktop")}
										label={__("Desktop", "galleryberg-gallery-block")}
										size="small"
									/>
									<Button
										icon={tablet}
										isPressed={selectedDevice === "tablet"}
										onClick={() => handleDeviceChange("Tablet")}
										label={__("Tablet", "galleryberg-gallery-block")}
										size="small"
									/>
									<Button
										icon={mobile}
										isPressed={selectedDevice === "mobile"}
										onClick={() => handleDeviceChange("Mobile")}
										label={__("Mobile", "galleryberg-gallery-block")}
										size="small"
									/>
								</div>
							</div>
							{selectedDevice === "desktop" && (
								<RangeControlWithoutToolsPanel
									label={__("Columns (Desktop)", "galleryberg-gallery-block")}
									attrKey="columns"
									min={1}
									max={Math.min(MAX_COLUMNS, images.length)}
									required={true}
									defaultValue={undefined}
									help={__(
										"Columns for desktop screens (>1024px)",
										"galleryberg-gallery-block",
									)}
								/>
							)}
							{selectedDevice === "tablet" && (
								<RangeControlWithoutToolsPanel
									label={__("Columns (Tablet)", "galleryberg-gallery-block")}
									attrKey="tabletColumns"
									min={1}
									max={Math.min(MAX_COLUMNS, images.length)}
									defaultValue={undefined}
									help={__(
										"Columns for tablet screens (768px - 1024px). Leave empty to use desktop value.",
										"galleryberg-gallery-block",
									)}
								/>
							)}
							{selectedDevice === "mobile" && (
								<RangeControlWithoutToolsPanel
									label={__("Columns (Mobile)", "galleryberg-gallery-block")}
									attrKey="mobileColumns"
									min={1}
									max={Math.min(MAX_COLUMNS, images.length)}
									defaultValue={undefined}
									help={__(
										"Columns for mobile screens (<768px). Leave empty to use tablet value.",
										"galleryberg-gallery-block",
									)}
								/>
							)}
						</>
					)}
					<ToggleControlWithoutToolsPanel
						label={__("Enable Hover Effect", "galleryberg-gallery-block")}
						attrKey="enableHoverEffect"
						defaultValue={false}
					/>
					{enableHoverEffect && (
						<SelectControlWithoutToolsPanel
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
					{EnableLazyLoading && EnableLazyLoading}
					{!EnableLazyLoading && !isPro && (
						<LockedControl featureKey="lazy-loading">
							<ToggleControl
								label={__("Enable Lazy Loading", "galleryberg-gallery-block")}
								checked={false}
								__nextHasNoMarginBottom
							/>
						</LockedControl>
					)}
				</PanelBody>
			</InspectorControls>
			<InspectorControls>
				<PanelBody
					title={__("Lightbox", "galleryberg-gallery-block")}
					initialOpen={false}
				>
					<ToggleControlWithoutToolsPanel
						label={__("Enable Lightbox", "galleryberg-gallery-block")}
						attrKey="lightbox"
						defaultValue={false}
					/>
					{lightbox && (
						<>
							<SelectControlWithoutToolsPanel
								label={__("Open Effect", "galleryberg-gallery-block")}
								attrKey="openEffect"
								options={[
									{ label: "Zoom", value: "zoom" },
									{ label: "Fade", value: "fade" },
									{ label: "None", value: "none" },
								]}
								defaultValue="zoom"
							/>
							<SelectControlWithoutToolsPanel
								label={__("Close Effect", "galleryberg-gallery-block")}
								attrKey="closeEffect"
								options={[
									{ label: "Zoom", value: "zoom" },
									{ label: "Fade", value: "fade" },
									{ label: "None", value: "none" },
								]}
								defaultValue="zoom"
							/>
							<SelectControlWithoutToolsPanel
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
							<ToggleControlWithoutToolsPanel
								label={__("Keyboard Navigation", "galleryberg-gallery-block")}
								attrKey="keyboardNavigation"
								defaultValue={true}
							/>
							<ToggleControlWithoutToolsPanel
								label={__("Loop", "galleryberg-gallery-block")}
								attrKey="loop"
								defaultValue={true}
							/>
							<ToggleControlWithoutToolsPanel
								label={__("Zoomable", "galleryberg-gallery-block")}
								attrKey="zoomable"
								defaultValue={true}
							/>
							<ToggleControlWithoutToolsPanel
								label={__("Draggable", "galleryberg-gallery-block")}
								attrKey="draggable"
								defaultValue={true}
							/>
							<ToggleControlWithoutToolsPanel
								label={__(
									"Show captions in lightbox",
									"galleryberg-gallery-block",
								)}
								attrKey="showLightboxCaptions"
								defaultValue={false}
								help={__(
									"Display image captions below the image when lightbox is enabled.",
									"galleryberg-gallery-block",
								)}
							/>
							{EnableThumbnails && EnableThumbnails}
							{ThumbnailPosition && ThumbnailPosition}
							{ThumbnailNavigation && ThumbnailNavigation}
							{ThumbnailNavigationSpeed && ThumbnailNavigationSpeed}{" "}
							{!EnableThumbnails && !isPro && (
								<LockedControl featureKey="lightbox-thumbnails">
									<ToggleControl
										label={__("Enable Thumbnails", "galleryberg-gallery-block")}
										checked={false}
										__nextHasNoMarginBottom
									/>
								</LockedControl>
							)}{" "}
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<InspectorControls>
				<PanelBody
					title={__("Caption Settings", "galleryberg-gallery-block")}
					initialOpen={false}
				>
					<ToggleControlWithoutToolsPanel
						label={__("Show Captions", "galleryberg-gallery-block")}
						attrKey="showCaptions"
						defaultValue={false}
						help={__(
							"Enable captions for all images in the gallery.",
							"galleryberg-gallery-block",
						)}
					/>
					<div style={{ gridColumn: "1 / -1" }}>
						<Tip>
							{__(
								"When enabled, individual image caption controls are disabled. All images will show captions using the gallery settings.",
								"galleryberg-gallery-block",
							)}
						</Tip>
					</div>

					<SelectControlWithoutToolsPanel
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
							"galleryberg-gallery-block",
						)}
					/>

					<SelectControlWithoutToolsPanel
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
							"galleryberg-gallery-block",
						)}
					/>

					{attributes.galleryCaptionType === "below" && (
						<ToggleGroupControlWithoutToolsPanel
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
								"galleryberg-gallery-block",
							)}
						/>
					)}
					{(attributes.galleryCaptionType === "full-overlay" ||
						attributes.galleryCaptionType === "bar-overlay") && (
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
											outline: "none",
											boxShadow: "none",
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
											outline: "none",
											boxShadow: "none",
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
											outline: "none",
											boxShadow: "none",
										}}
									>
										{__("💡 Request a Feature", "galleryberg-gallery-block")}
									</a>
								</li>
							</ul>
							<hr style={{ border: 0, borderTop: "1px solid #e5e7eb" }} />
							<div style={{ marginTop: "12px" }}>
								<a
									href="https://galleryberg.com/pricing/#wp-block-suite"
									target="_blank"
									rel="noopener noreferrer"
									style={{
										textDecoration: "none",
										color: "#1e1e1e",
										outline: "none",
										boxShadow: "none",
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
								{__("GET GALLERYBERG PRO", "galleryberg-gallery-block")}
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
								{__("Get Lifetime Access - $149", "galleryberg-gallery-block")}
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
