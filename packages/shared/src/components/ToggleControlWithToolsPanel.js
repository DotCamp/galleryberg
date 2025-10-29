/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from "@wordpress/components";

function ToggleControlWithToolsPanel({
	label,
	attrKey,
	defaultValue = false,
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

	const checked = attributes[attrKey];

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
			hasValue={() => checked !== defaultValue}
		>
			<ToggleControl
				label={label}
				checked={checked}
				onChange={(newValue) => {
					setAttributes({
						[attrKey]: newValue,
					});
				}}
				__nextHasNoMarginBottom
			/>
		</ToolsPanelItem>
	);
}

export default ToggleControlWithToolsPanel;
