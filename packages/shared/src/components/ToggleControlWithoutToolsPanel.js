import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { ToggleControl } from "@wordpress/components";

function ToggleControlWithoutToolsPanel({
	label,
	attrKey,
	defaultValue = false,
	help = "",
}) {
	const { clientId } = useBlockEditContext();

	const attributes = useSelect((select) =>
		select("core/block-editor").getBlockAttributes(clientId),
	);
	const { updateBlockAttributes } = useDispatch("core/block-editor");
	const setAttributes = (newAttributes) => {
		updateBlockAttributes(clientId, newAttributes);
	};

	const checked = attributes[attrKey];

	return (
		<ToggleControl
			label={label}
			checked={checked}
			onChange={(newValue) => {
				setAttributes({ [attrKey]: newValue });
			}}
			help={help}
			__nextHasNoMarginBottom
		/>
	);
}

export default ToggleControlWithoutToolsPanel;
