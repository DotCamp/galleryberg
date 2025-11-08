import { __ } from "@wordpress/i18n";
import { RangeControlWithToolsPanel } from "@galleryberg/shared";

function ImagePro(props) {
	const { attributes, clientId, BlockEdit, context } = props;
	const { mosaicSpanX, mosaicSpanY } = attributes;

	// Get layout from parent gallery context
	const layout = context?.layout;

	const mosaicStyles = {};
	if (layout === "mosaic") {
		const spanX = mosaicSpanX || 1;
		const spanY = mosaicSpanY || 1;
		if (spanX > 1) {
			mosaicStyles.gridColumn = `span ${spanX}`;
		}
		if (spanY > 1) {
			mosaicStyles.gridRow = `span ${spanY}`;
		}
	}

	const MosaicSpanX = layout === "mosaic" && (
		<RangeControlWithToolsPanel
			label={__("Mosaic Column Span ", "galleryberg-gallery-block-pro")}
			attrKey="mosaicSpanX"
			min={1}
			max={5}
			step={1}
			defaultValue={1}
			help={__(
				"Number of columns this image spans in mosaic layout",
				"galleryberg-gallery-block-pro"
			)}
		/>
	);

	const MosaicSpanY = layout === "mosaic" && (
		<RangeControlWithToolsPanel
			label={__("Mosaic Row Span", "galleryberg-gallery-block-pro")}
			attrKey="mosaicSpanY"
			min={1}
			max={5}
			step={1}
			defaultValue={1}
			help={__(
				"Number of rows this image spans in mosaic layout",
				"galleryberg-gallery-block-pro"
			)}
		/>
	);

	const proProps = {
		...props,
		MosaicSpanX,
		MosaicSpanY,
		mosaicStyles,
		isPro: true,
	};

	return (
		<>
			<BlockEdit {...proProps} />
		</>
	);
}

export default ImagePro;
