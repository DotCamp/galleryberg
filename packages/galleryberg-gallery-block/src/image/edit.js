import { isEmpty, get } from "lodash";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { useState, useRef, useMemo, useEffect } from "react";
import CustomMediaPlaceholder from "./media-placeholder";
import { ResizableBox } from "@wordpress/components";
import {
	RichText,
	useBlockProps,
	__experimentalGetElementClassName,
	__experimentalImageEditor as ImageEditor,
} from "@wordpress/block-editor";
import Image from "./image";
import Inspector from "./inspector";
import BlockControls from "./block-controls";
import classNames from "classnames";
import exampleImage from "./preview.png";
import {
	generateStyles,
	getSpacingPresetCssVar,
	getBackgroundColorVar,
} from "@galleryberg/shared";

function Edit(props) {
	const {
		attributes,
		setAttributes,
		isSelected,
		context,
		mosaicStyles = {},
	} = props;
	const {
		media,
		height,
		width,
		caption,
		align,
		borderRadius,
		showCaption: showCaptionAttr,
		captionType = "",
		captionVisibility = "",
		captionAlignment = "",
		captionColor = "",
		captionBackgroundColor = "",
		captionBackgroundGradient = "",
	} = attributes;

	// Compute showCaption directly from attribute or gallery context
	// If gallery showCaptions is ON, always show (can't be turned off individually)
	// If gallery showCaptions is OFF, use individual image setting
	const galleryShouldShowCaptions = context?.showCaptions || false;
	const showCaption = galleryShouldShowCaptions
		? true
		: showCaptionAttr || false;

	const [isImageEditing, setIsEditingImage] = useState(false);
	const imageRef = useRef(null);

	const effectiveBorderRadius = isEmpty(borderRadius)
		? context?.imagesBorderRadius
		: borderRadius;

	const effectiveCaptionType = isEmpty(captionType)
		? context?.galleryCaptionType
		: captionType;
	const effectiveCaptionVisibility = isEmpty(captionVisibility)
		? context?.galleryCaptionVisibility
		: captionVisibility;
	const effectiveCaptionAlignment = isEmpty(captionAlignment)
		? context?.galleryCaptionAlignment
		: captionAlignment;
	const effectiveCaptionColor = isEmpty(captionColor)
		? context?.galleryCaptionColor
		: captionColor;
	const effectiveCaptionBackgroundColor = isEmpty(captionBackgroundColor)
		? context?.galleryCaptionBackgroundColor
		: captionBackgroundColor;
	const effectiveCaptionBackgroundGradient = isEmpty(captionBackgroundGradient)
		? context?.galleryCaptionBackgroundGradient
		: captionBackgroundGradient;

	// Combine color and gradient for caption background
	const captionBgStyle = getBackgroundColorVar(
		{
			captionBackgroundColor: effectiveCaptionBackgroundColor,
			captionBackgroundGradient: effectiveCaptionBackgroundGradient,
		},
		"captionBackgroundColor",
		"captionBackgroundGradient",
	);

	const styles = {};
	if (context?.layout === "justified") {
		if (context?.justifiedRowHeight) {
			styles.height = context.justifiedRowHeight + "px";
		}
	} else if (context?.layout === "masonry" && context?.blockSpacing) {
		const blockGap =
			getSpacingPresetCssVar(context?.blockSpacing?.top) ?? "16px";

		styles.marginBottom = blockGap;
	}

	// Merge pro-provided mosaic styles
	Object.assign(styles, mosaicStyles);

	const hoverEffect = context?.hoverEffect || "zoom-in";

	const blockProps = useBlockProps({
		className: classNames("galleryberg-image", {
			"galleryberg-image-center": align === "center",
			"galleryberg-image-right": align === "right",
			"has-hover-effect": context?.enableHoverEffect,
			[`hover-${hoverEffect}`]: context?.enableHoverEffect,
		}),
		style: generateStyles(styles),
	});
	const hasImage = !isEmpty(media);
	const { toggleSelection } = useDispatch("core/block-editor");
	const { naturalWidth, naturalHeight, imageUrl } = useMemo(() => {
		return {
			imageUrl: imageRef.current?.src || "",
			naturalWidth: imageRef.current?.naturalWidth || undefined,
			naturalHeight: imageRef.current?.naturalHeight || undefined,
		};
	}, [imageRef.current?.complete]);

	const onResizeStart = () => {
		toggleSelection(false);
	};

	const onResizeStop = () => {
		toggleSelection(true);
	};

	const fallbackClientWidth = imageRef.current?.width;
	const id = get(media, "id", "");
	const sizeSlug = get(attributes, "sizeSlug", "large");
	const numericWidth = width ? parseInt(width, 10) : undefined;
	const numericHeight = height ? parseInt(height, 10) : undefined;

	useEffect(() => {
		if (!numericWidth || !naturalWidth || !naturalHeight) {
			return;
		}
		let ratio = 1;

		if (!attributes.aspectRatio) {
			ratio = (naturalWidth || 1) / (naturalHeight || 1);
		} else {
			const sratio = attributes.aspectRatio.split("/", 2);
			if (sratio.length > 1) {
				ratio = parseInt(sratio[0]) / parseInt(sratio[1]);
			}
		}
		let h = numericWidth / ratio;
		setAttributes({
			height: `${h}px`,
		});
	}, [attributes.aspectRatio]);

	if (attributes.isExample) {
		return <img src={exampleImage} style={{ maxWidth: "100%" }}></img>;
	}

	return (
		<figure {...blockProps}>
			{hasImage && (
				<>
					<BlockControls
						setIsEditingImage={setIsEditingImage}
						showCaption={showCaption}
						attributes={attributes}
						setAttributes={setAttributes}
						context={context}
					/>
					{!isImageEditing && (
						<ResizableBox
							size={{
								width,
								height,
							}}
							showHandle={isSelected}
							minWidth={"50"}
							minHeight={"50"}
							maxWidth="720px"
							enable={{
								top: false,
								right: true,
								bottom: true,
								left: false,
							}}
							style={{
								position: "relative",
							}}
							onResize={(_, direction, elt) => {
								let ratio = 1;

								if (!attributes.aspectRatio) {
									ratio = (naturalWidth || 1) / (naturalHeight || 1);
								} else {
									const sratio = attributes.aspectRatio.split("/", 2);
									if (sratio.length > 1) {
										ratio = parseInt(sratio[0]) / parseInt(sratio[1]);
									}
								}
								let w = elt.offsetWidth;
								let h = elt.offsetHeight;

								if (direction === "bottom") {
									w = h * ratio;
								} else {
									h = w / ratio;
								}

								setAttributes({
									width: `${w}px`,
									height: `${h}px`,
								});
							}}
							onResizeStart={onResizeStart}
							onResizeStop={() => {
								onResizeStop();
							}}
						>
							<Image
								imageRef={imageRef}
								attributes={attributes}
								setAttributes={setAttributes}
								borderRadius={effectiveBorderRadius}
								context={context}
							/>
							{showCaption && (!RichText.isEmpty(caption) || isSelected) && (
								<RichText
									identifier="caption"
									className={classNames(
										__experimentalGetElementClassName("caption"),
										`caption-type-${effectiveCaptionType}`,
										`caption-visibility-${effectiveCaptionVisibility}`,
										// Format caption alignment class correctly - handle both standard and matrix formats
										effectiveCaptionAlignment &&
											effectiveCaptionAlignment.includes(" ")
											? `caption-align-${effectiveCaptionAlignment.replace(
													" ",
													"-",
												)}`
											: `caption-align-${effectiveCaptionAlignment}`,
									)}
									tagName="figcaption"
									aria-label={__(
										"Image caption text",
										"galleryberg-gallery-block",
									)}
									placeholder={__("Add caption", "galleryberg-gallery-block")}
									value={caption}
									onChange={(value) => setAttributes({ caption: value })}
									inlineToolbar
									style={{
										color: effectiveCaptionColor || undefined,
										background: captionBgStyle || undefined,
										// Only set textAlign directly for simple alignment values (left/center/right)
										textAlign:
											!effectiveCaptionAlignment ||
											effectiveCaptionAlignment.includes(" ")
												? undefined
												: effectiveCaptionAlignment,
									}}
								/>
							)}
						</ResizableBox>
					)}
					{isImageEditing && (
						<ImageEditor
							id={id}
							url={imageUrl}
							width={numericWidth}
							height={numericHeight}
							clientWidth={fallbackClientWidth}
							naturalHeight={naturalHeight}
							naturalWidth={naturalWidth}
							onSaveImage={(imageAttributes) => {
								setAttributes({
									media: {
										...media,
										...imageAttributes,
										sizes: {
											...media.sizes,
											[sizeSlug]: {
												...media.sizes[sizeSlug],
												...imageAttributes,
											},
										},
									},
								});
							}}
							onFinishEditing={() => {
								setIsEditingImage(false);
							}}
						/>
					)}
					<Inspector {...props} />
				</>
			)}
			{!hasImage && (
				<CustomMediaPlaceholder
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			)}
		</figure>
	);
}

export default Edit;
