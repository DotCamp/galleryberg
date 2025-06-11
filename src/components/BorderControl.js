/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import {
	useBlockEditContext,
	store as BlockEditorStore,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalBorderBoxControl as BorderBoxControl,
} from "@wordpress/components";

function BorderControl({
	label,
	isShownByDefault = true,
	value,
	onChange = () => {},
	resetAllFilter,
	onDeselect = () => {},
}) {
	const { clientId } = useBlockEditContext();

	const { defaultColors } = useSelect((select) => {
		return {
			defaultColors:
				select(BlockEditorStore).getSettings()?.__experimentalFeatures?.color
					?.palette?.default,
		};
	}, []);

	if (!resetAllFilter) {
		resetAllFilter = onDeselect;
	}

	return (
		<ToolsPanelItem
			panelId={clientId}
			isShownByDefault={isShownByDefault}
			resetAllFilter={resetAllFilter}
			hasValue={() => !isEmpty(value)}
			label={label}
			onDeselect={onDeselect}
		>
			<BorderBoxControl
				enableAlpha
				size={"__unstable-large"}
				colors={defaultColors}
				label={label}
				onChange={onChange}
				value={value}
			/>
		</ToolsPanelItem>
	);
}

export default BorderControl;
