/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	SelectControl,
} from "@wordpress/components";

function SelectControlWithToolsPanel({
	label,
	attrKey,
	options,
	defaultValue = "",
	help,
	isShownByDefault = true,
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
		<ToolsPanelItem
			panelId={clientId}
			isShownByDefault={isShownByDefault}
			resetAllFilter={() => {
				setAttributes({
					[attrKey]: defaultValue,
				});
			}}
			label={label}
			onDeselect={() => setAttributes({ [attrKey]: defaultValue })}
			hasValue={() => value !== defaultValue}
		>
			<SelectControl
				label={label}
				value={value}
				options={options}
				onChange={(newValue) => {
					setAttributes({
						[attrKey]: newValue,
					});
				}}
				help={help}
				size={"__unstable-large"}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</ToolsPanelItem>
	);
}

export default SelectControlWithToolsPanel;
