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
} from "../utils/styling-helpers";

function Edit(props) {
	const { attributes, setAttributes, isSelected, context } = props;
	const { media, height, width, caption, align, borderRadius } = attributes;
	const [showCaption, setShowCaption] = useState(!!caption);
	const [isImageEditing, setIsEditingImage] = useState(false);
	const imageRef = useRef(null);

	const effectiveBorderRadius = isEmpty(borderRadius) ? context?.imagesBorderRadius : borderRadius;

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

	const blockProps = useBlockProps({
		className: classNames("galleryberg-image", {
			"galleryberg-image-center": align === "center",
			"galleryberg-image-right": align === "right",
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
						setShowCaption={setShowCaption}
						attributes={attributes}
						setAttributes={setAttributes}
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
							/>
							{showCaption && (!RichText.isEmpty(caption) || isSelected) && (
								<RichText
									identifier="caption"
									className={__experimentalGetElementClassName("caption")}
									tagName="figcaption"
									aria-label={__(
										"Image caption text",
										"galleryberg-gallery-block",
									)}
									placeholder={__("Add caption", "galleryberg-gallery-block")}
									value={caption}
									onChange={(value) => setAttributes({ caption: value })}
									inlineToolbar
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
					<Inspector attributes={attributes} setAttributes={setAttributes} />
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
