import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

function ToggleGroupControlWithoutToolsPanel({
	label,
	attrKey,
	options,
	defaultValue = "",
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
		<ToggleGroupControl
			label={label}
			isBlock
			value={value}
			onChange={(newValue) => {
				setAttributes({ [attrKey]: newValue });
			}}
			help={help}
			__nextHasNoMarginBottom
		>
			{options.map((option) => (
				<ToggleGroupControlOption
					key={option.value}
					label={option.label}
					value={option.value}
				/>
			))}
		</ToggleGroupControl>
	);
}

export default ToggleGroupControlWithoutToolsPanel;
