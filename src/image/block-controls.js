import { get, isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useEffect } from "react";
import { alignNone, caption as captionIcon, crop } from "@wordpress/icons";
import {
	BlockControls as WPBlockControls,
	MediaReplaceFlow,
	__experimentalImageURLInputUI as ImageURLInputUI,
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
	BlockAlignmentToolbar,
} from "@wordpress/block-editor";
import { usePrevious } from "@wordpress/compose";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { ToolbarWithDropdown } from "../components";

function BlockControls(props) {
	const {
		attributes,
		setAttributes,
		setShowCaption,
		showCaption,
		setIsEditingImage,
		context,
	} = props;
	const {
		media,
		caption,
		linkClass,
		linkDestination,
		linkTarget,
		href,
		rel,
		align,
		captionType = "",
		captionAlignment = "",
	} = attributes;
	const prevCaption = usePrevious(caption);

	useEffect(() => {
		if (caption && !prevCaption) {
			setShowCaption(true);
		}
	}, [caption, prevCaption]);
	const imageUrl = get(media, "url", "");
	const mediaId = get(media, "id", -1);
	const imageLink = get(media, "link", "");

	// Get effective caption type and alignment from context or individual attributes
	const effectiveCaptionType = isEmpty(captionType)
		? context?.galleryCaptionType
		: captionType;

	function onSetHref(props) {
		setAttributes(props);
	}
	return (
		<>
			<WPBlockControls group={"block"}>
				<BlockAlignmentToolbar
					label={__("Alignment", "galleryberg-gallery-block")}
					value={align}
					onChange={(newVal) => {
						setAttributes({ align: newVal });
					}}
				/>

				{showCaption &&
					(effectiveCaptionType === "full-overlay" ||
						effectiveCaptionType === "bar-overlay") && (
						<BlockAlignmentMatrixControl
							label={__("Change caption position", "galleryberg-gallery-block")}
							value={captionAlignment}
							onChange={(nextPosition) =>
								setAttributes({
									captionAlignment: nextPosition,
								})
							}
						/>
					)}
				<ToolbarButton
					onClick={() => {
						setShowCaption(!showCaption);
						if (showCaption && caption) {
							setAttributes({ caption: undefined });
						}
					}}
					icon={captionIcon}
					isPressed={showCaption}
					label={showCaption ? __("Remove caption") : __("Add caption")}
				/>
				<ImageURLInputUI
					url={href || ""}
					onChangeUrl={onSetHref}
					linkDestination={linkDestination}
					mediaUrl={imageUrl}
					mediaLink={imageLink}
					linkTarget={linkTarget}
					linkClass={linkClass}
					rel={rel}
				/>
				<ToolbarButton
					onClick={() => setIsEditingImage(true)}
					icon={crop}
					label={__("Crop", "galleryberg-gallery-block")}
				/>
			</WPBlockControls>
			<WPBlockControls>
				<ToolbarGroup>
					<MediaReplaceFlow
						mediaURL={imageUrl}
						mediaId={mediaId}
						onSelect={(newMedia) =>
							setAttributes({
								media: newMedia,
								alt: newMedia.alt,
							})
						}
						name={__("Replace", "galleryberg-gallery-block")}
					/>
				</ToolbarGroup>
			</WPBlockControls>
		</>
	);
}
export default BlockControls;
