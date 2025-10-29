import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	useInnerBlocksProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
} from "@wordpress/block-editor";
import "./editor.scss";
import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { BlockIcon } from "@wordpress/block-editor";
import { useMemo, useEffect } from "@wordpress/element";
import classNames from "classnames";
import Inspector from "./inspector";
import {
	generateStyles,
	getBackgroundColorVar,
	getBorderCSS,
	getSingleSideBorderValue,
	getSpacingCss,
	getSpacingPresetCssVar,
} from "@galleryberg/shared";
import { blockIcon } from "./block-icon";

const DEFAULT_BLOCK = { name: "galleryberg/image" };
const ALLOWED_MEDIA_TYPES = ["image"];
const PLACEHOLDER_TEXT = __(
	"Drag and drop images, upload, or choose from your library.",
	"galleryberg",
);

export default function Edit(props) {
	const { attributes, setAttributes, clientId } = props;
	const {
		align,
		columns,
		layout = "tiles",
		blockSpacing,
		isGapSeparated,
		padding,
		margin,
		border,
		galleryCaptionAlignment,
		borderRadius,
		galleryCaptionType,
	} = attributes;

	useEffect(() => {
		if (!isGapSeparated && blockSpacing?.all) {
			setAttributes({
				blockSpacing: {
					top: blockSpacing.all,
					bottom: blockSpacing.all,
					left: blockSpacing.all,
					right: blockSpacing.all,
				},
				isGapSeparated: true,
			});
		}
	}, []);

	const blockGapRow = getSpacingPresetCssVar(blockSpacing?.top) ?? "16px";
	const blockGapColumn = getSpacingPresetCssVar(blockSpacing?.left) ?? "16px";
	const bgColor = getBackgroundColorVar(
		attributes,
		"backgroundColor",
		"backgroundGradient",
	);
	const paddingObj = getSpacingCss(padding ?? {});
	const marginObj = getSpacingCss(margin ?? {});

	let styles = {
		rowGap: blockGapRow,
		columnGap: blockGapColumn,
		background: bgColor,
		"border-top-left-radius": borderRadius?.topLeft,
		"border-top-right-radius": borderRadius?.topRight,
		"border-bottom-left-radius": borderRadius?.bottomLeft,
		"border-bottom-right-radius": borderRadius?.bottomRight,
		"padding-top": paddingObj?.top,
		"padding-right": paddingObj?.right,
		"padding-bottom": paddingObj?.bottom,
		"padding-left": paddingObj?.left,
		"margin-top": marginObj?.top,
		"margin-right": marginObj?.right,
		"margin-bottom": marginObj?.bottom,
		"margin-left": marginObj?.left,
		borderTop: getSingleSideBorderValue(getBorderCSS(border), "top"),
		borderLeft: getSingleSideBorderValue(getBorderCSS(border), "left"),
		borderRight: getSingleSideBorderValue(getBorderCSS(border), "right"),
		borderBottom: getSingleSideBorderValue(getBorderCSS(border), "bottom"),
	};
	if (layout === "tiles" || layout === "square") {
		styles.gridTemplateColumns = `repeat(${columns || 3}, 1fr)`;
	}
	if (layout === "masonry") {
		styles.columnCount = `${columns}` || "3";
	}

	const blockProps = useBlockProps({
		className: classNames("galleryberg-gallery-container", {
			[`align${align}`]: align,
			[`columns-${columns}`]: columns !== undefined,
			[`columns-default`]: columns === undefined,
			[`layout-${layout}`]: layout,
		}),
		style: generateStyles(styles),
	});
	const { createErrorNotice } = useDispatch(noticesStore);
	const { replaceInnerBlocks, selectBlock } = useDispatch("core/block-editor");
	const { innerBlockImages } = useSelect(
		(select) => {
			const { getBlock } = select("core/block-editor");
			return {
				innerBlockImages: getBlock(clientId)?.innerBlocks || [],
			};
		},
		[clientId],
	);

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ["galleryberg/image"],
		defaultBlock: DEFAULT_BLOCK,
		directInsert: true,
		orientation: "horizontal",
		renderAppender: false,
	});
	const images = useMemo(
		() =>
			innerBlockImages?.map((block) => ({
				clientId: block.clientId,
				id: block.attributes.media.id,
				url: block.attributes.media.url,
				attributes: block.attributes,
				fromSavedContent: Boolean(block.originalContent),
			})),
		[innerBlockImages],
	);

	function onUploadError(message) {
		createErrorNotice(message, { type: "snackbar" });
	}

	function isValidFileType(file) {
		const mediaTypeSelector = file.type;

		return (
			ALLOWED_MEDIA_TYPES.some(
				(mediaType) => mediaTypeSelector?.indexOf(mediaType) === 0,
			) || file.blob
		);
	}

	function createBlobURL(file) {
		return URL.createObjectURL(file);
	}

	function updateImages(selectedImages) {
		const newFileUploads =
			Object.prototype.toString.call(selectedImages) === "[object FileList]";

		const imageArray = newFileUploads
			? Array.from(selectedImages).map((file) => {
					if (!file.url) {
						return {
							blob: createBlobURL(file),
						};
					}
					return file;
			  })
			: selectedImages;

		if (!imageArray.every(isValidFileType)) {
			createErrorNotice(
				__("If uploading to a gallery all files need to be image formats"),
				{ id: "gallery-upload-invalid-file", type: "snackbar" },
			);
		}

		const processedImages = imageArray
			.filter((file) => file.url || isValidFileType(file))
			.map((file) => {
				if (!file.url) {
					return {
						blob: file.blob || createBlobURL(file),
					};
				}
				return file;
			});

		// Create a map to maintain the order of images
		const newOrderMap = processedImages.reduce((result, image, index) => {
			result[image.id] = index;
			return result;
		}, {});

		const existingImageBlocks = !newFileUploads
			? innerBlockImages.filter((block) =>
					processedImages.find((img) => img.id === block.attributes.id),
			  )
			: innerBlockImages;

		const newImageList = processedImages.filter(
			(img) =>
				!existingImageBlocks.find(
					(existingImg) => img.id === existingImg.attributes.id,
				),
		);

		// Create new image blocks for new images
		const newBlocks = newImageList.map((image) => {
			return createBlock("galleryberg/image", {
				media: {
					id: image.id,
					blob: image.blob,
					url: image.url,
				},
				caption: image.caption,
				alt: image.alt,
			});
		});

		// Replace inner blocks with sorted combination of existing and new blocks
		replaceInnerBlocks(
			clientId,
			existingImageBlocks
				.concat(newBlocks)
				.sort(
					(a, b) => newOrderMap[a.attributes.id] - newOrderMap[b.attributes.id],
				),
		);

		// Select the first block to scroll into view when new blocks are added
		if (newBlocks?.length > 0) {
			selectBlock(newBlocks[0].clientId);
		}
	}
	const hasImages = !!images.length;
	const hasImageIds = hasImages && images.some((image) => !!image.id);
	const inspectorProps = {
		hasImages,
		hasImageIds,
		...props,
		images,
	};
	return (
		<>
			<BlockControls group="other">
				<MediaReplaceFlow
					allowedTypes={ALLOWED_MEDIA_TYPES}
					accept="image/*"
					handleUpload={false}
					onSelect={updateImages}
					name={__("Add")}
					multiple
					mediaIds={images.filter((image) => image.id).map((image) => image.id)}
					addToGallery={hasImageIds}
				/>
			</BlockControls>
			<BlockControls group="block">
				<BlockAlignmentMatrixControl
					label={__("Change caption position", "galleryberg-gallery-block")}
					value={galleryCaptionAlignment}
					onChange={(nextPosition) =>
						setAttributes({
							galleryCaptionAlignment: nextPosition,
						})
					}
					isDisabled={
						!hasImages ||
						(galleryCaptionType !== "full-overlay" &&
							galleryCaptionType !== "bar-overlay")
					}
				></BlockAlignmentMatrixControl>
			</BlockControls>
			<Inspector {...inspectorProps} />
			<figure {...innerBlocksProps}>
				{innerBlockImages.length > 0 && innerBlocksProps.children}
				{innerBlockImages.length <= 0 && (
					<MediaPlaceholder
						icon={blockIcon}
						labels={{
							title: __("Gallery", "galleryberg-gallery-block"),
							instructions: PLACEHOLDER_TEXT,
						}}
						onSelect={updateImages}
						accept="image/*"
						allowedTypes={ALLOWED_MEDIA_TYPES}
						multiple
						onError={onUploadError}
					/>
				)}
			</figure>
		</>
	);
}
