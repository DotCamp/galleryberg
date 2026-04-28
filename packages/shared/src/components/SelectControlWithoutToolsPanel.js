import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { SelectControl } from "@wordpress/components";

function SelectControlWithoutToolsPanel({
	label,
	attrKey,
	options,
	defaultValue = "",
	help,
	onAfterChange,
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
		<SelectControl
			label={label}
			value={value}
			options={options}
			onChange={(newValue) => {
				setAttributes({ [attrKey]: newValue });
				onAfterChange?.(newValue);
			}}
			help={help}
			size="__unstable-large"
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>
	);
}

export default SelectControlWithoutToolsPanel;
