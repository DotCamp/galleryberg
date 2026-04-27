import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { RangeControl } from "@wordpress/components";

function RangeControlWithoutToolsPanel({
	label,
	attrKey,
	min,
	max,
	step,
	defaultValue = 0,
	required = false,
	help,
}) {
	const { clientId } = useBlockEditContext();

	const attributes = useSelect((select) =>
		select("core/block-editor").getBlockAttributes(clientId),
	);
	const { updateBlockAttributes } = useDispatch("core/block-editor");
	const setAttributes = (newAttributes) => {
		updateBlockAttributes(clientId, newAttributes);
	};

	const value = attributes[attrKey];

	return (
		<RangeControl
			label={label}
			value={value}
			onChange={(newValue) => {
				setAttributes({ [attrKey]: newValue });
			}}
			min={min}
			max={max}
			step={step}
			required={required}
			help={help}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>
	);
}

export default RangeControlWithoutToolsPanel;
