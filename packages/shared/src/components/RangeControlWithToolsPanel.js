/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockEditContext } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	RangeControl,
} from "@wordpress/components";

function RangeControlWithToolsPanel({
	label,
	attrKey,
	min,
	max,
	step,
	defaultValue = 0,
	required = false,
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
			<RangeControl
				label={label}
				value={value}
				onChange={(newValue) => {
					setAttributes({
						[attrKey]: newValue,
					});
				}}
				min={min}
				max={max}
				step={step}
				required={required}
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>
		</ToolsPanelItem>
	);
}

export default RangeControlWithToolsPanel;
