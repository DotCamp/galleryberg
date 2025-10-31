/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

function ToggleGroupControlWithToolsPanel({
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
			<ToggleGroupControl
				label={label}
				isBlock
				value={value}
				onChange={(newValue) => {
					setAttributes({
						[attrKey]: newValue,
					});
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
		</ToolsPanelItem>
	);
}

export default ToggleGroupControlWithToolsPanel;
