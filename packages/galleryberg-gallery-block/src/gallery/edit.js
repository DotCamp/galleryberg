import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	useInnerBlocksProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
} from "@wordpress/block-editor";
import { ToolbarButton } from "@wordpress/components";
import "./editor.scss";
import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { useMemo, useEffect, useState } from "@wordpress/element";
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
import { store as editorStore } from "@wordpress/editor";
import { shuffle } from "@wordpress/icons";

const DEFAULT_BLOCK = { name: "galleryberg/image" };
const ALLOWED_MEDIA_TYPES = ["image"];
const PLACEHOLDER_TEXT = __(
	"Drag and drop images, upload, or choose from your library.",
	"galleryberg-gallery-block",
);

export default function Edit(props) {
	const { attributes, setAttributes, clientId } = props;
	const {
		align,
		columns,
		mobileColumns,
		tabletColumns,
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
	// Local state for device selection
	const [selectedDevice, setSelectedDevice] = useState("desktop");
	// Dispatch to change device type
	const { setDeviceType } = useDispatch(editorStore);

	// Handler to change device
	const handleDeviceChange = (device) => {
		setDeviceType(device);
	};
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

	// Get device type from Gutenberg's responsive preview to apply correct columns
	const { deviceType } = useSelect((select) => {
		const { getDeviceType } = select(editorStore);
		return {
			deviceType: getDeviceType ? getDeviceType() : "Desktop",
		};
	});
	useEffect(() => {
		if (deviceType) {
			setSelectedDevice(deviceType.toLowerCase());
		}
	}, [deviceType]);
	// Determine which column value to use based on device preview
	const getActiveColumns = () => {
		const device = selectedDevice;

		if (device === "mobile") {
			// Mobile: use mobileColumns, fallback to tabletColumns, then columns
			return mobileColumns || tabletColumns || columns || 3;
		} else if (device === "tablet") {
			// Tablet: use tabletColumns, fallback to columns
			return tabletColumns || columns || 3;
		}
		// Desktop: use columns
		return columns || 3;
	};

	const activeColumns = getActiveColumns();

	const blockGapRow = getSpacingPresetCssVar(blockSpacing?.top) ?? "";
	const blockGapColumn = getSpacingPresetCssVar(blockSpacing?.left) ?? "";
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
	if (layout === "tiles" || layout === "square" || layout === "mosaic") {
		styles.gridTemplateColumns = `repeat(${activeColumns}, 1fr)`;
	}
	if (layout === "masonry") {
		styles.columnCount = `${activeColumns}`;
	}

	const blockProps = useBlockProps({
		className: classNames("galleryberg-gallery-container", {
			[`align${align}`]: align,
			[`columns-${activeColumns}`]: activeColumns !== undefined,
			[`columns-default`]: activeColumns === undefined,
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
			: Array.isArray(selectedImages)
				? selectedImages
				: [selectedImages];

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

		const getImageKey = (image) => image?.id ?? image?.url ?? image?.blob;

		// Create a map of existing blocks by their media attributes for quick lookup
		const existingBlocksMap = innerBlockImages.reduce((result, block) => {
			const key =
				block.attributes?.media?.id ??
				block.attributes?.media?.url ??
				block.attributes?.media?.blob ??
				block.attributes?.id;
			if (key) {
				result[key] = block;
			}
			return result;
		}, {});

		// Separate existing images from new ones
		const existingImagesInSelection = processedImages.filter(
			(image) => existingBlocksMap[getImageKey(image)],
		);
		const newImagesOnly = processedImages.filter(
			(image) => !existingBlocksMap[getImageKey(image)],
		);

		// Check if this is "add to gallery" mode:
		// 1. All existing blocks are in the selection plus some new images (MediaReplaceFlow with addToGallery)
		// 2. OR only new images are being added when gallery already has images (upload button)
		const isAddToGalleryMode =
			(existingImagesInSelection.length === innerBlockImages.length &&
				newImagesOnly.length > 0) ||
			(existingImagesInSelection.length === 0 &&
				newImagesOnly.length > 0 &&
				innerBlockImages.length > 0);

		let finalBlocks = [];
		const newBlocks = [];

		if (isAddToGalleryMode) {
			// Add to gallery mode: Keep existing blocks and only append new images
			finalBlocks = [...innerBlockImages];

			newImagesOnly.forEach((image) => {
				const newBlock = createBlock("galleryberg/image", {
					media: {
						id: image.id,
						blob: image.blob,
						url: image.url,
					},
					caption: image.caption,
					alt: image.alt,
				});
				finalBlocks.push(newBlock);
				newBlocks.push(newBlock);
			});
		} else {
			// Reorder/replace mode: Reorder based on selection, preserving captions
			processedImages.forEach((image) => {
				const existingBlock = existingBlocksMap[getImageKey(image)];

				if (existingBlock) {
					// Image already exists - reuse the existing block to preserve captions
					finalBlocks.push(existingBlock);
				} else {
					// New image - create a new block
					const newBlock = createBlock("galleryberg/image", {
						media: {
							id: image.id,
							blob: image.blob,
							url: image.url,
						},
						caption: image.caption,
						alt: image.alt,
					});
					finalBlocks.push(newBlock);
					newBlocks.push(newBlock);
				}
			});
		}

		// Replace inner blocks with the reordered/updated blocks
		replaceInnerBlocks(clientId, finalBlocks);

		// Select the first new block
		if (newBlocks?.length > 0) {
			selectBlock(newBlocks[0].clientId);
		}
	}
	function shuffleImages() {
		const shuffled = [...innerBlockImages];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		replaceInnerBlocks(clientId, shuffled);
	}

	const hasImages = !!images.length;
	const hasImageIds = hasImages && images.some((image) => !!image.id);
	const inspectorProps = {
		hasImages,
		hasImageIds,
		...props,
		images,
		handleDeviceChange,
		selectedDevice,
	};
	return (
		<>
			<BlockControls group="other">
				<ToolbarButton
					icon={shuffle}
					label={__("Shuffle images", "galleryberg-gallery-block")}
					onClick={shuffleImages}
					disabled={!hasImages || images.length < 2}
				/>
				<MediaReplaceFlow
					allowedTypes={ALLOWED_MEDIA_TYPES}
					accept="image/*"
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
