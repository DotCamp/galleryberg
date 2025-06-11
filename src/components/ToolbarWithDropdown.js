import { ToolbarGroup } from "@wordpress/components";
import {
	alignNone,
	positionLeft,
	positionCenter,
	positionRight,
	stretchFullWidth,
	stretchWide,
} from "@wordpress/icons";

const alignControls = [
	{
		icon: alignNone,
		title: "None",
		value: undefined,
	},
	{
		icon: positionLeft,
		title: "Align left",
		value: "left",
	},
	{
		icon: positionCenter,
		title: "Align center",
		value: "center",
	},
	{
		icon: positionRight,
		title: "Align right",
		value: "right",
	},
];

const alignControlsWithWidth = [
	{
		icon: alignNone,
		title: "None",
		value: undefined,
	},
	{
		icon: positionLeft,
		title: "Align left",
		value: "left",
	},
	{
		icon: positionCenter,
		title: "Align center",
		value: "center",
	},
	{
		icon: positionRight,
		title: "Align right",
		value: "right",
	},
	{
		icon: stretchWide,
		title: "Wide width",
		value: "wide",
	},
	{
		icon: stretchFullWidth,
		title: "Full Width",
		value: "full",
	},
];

export default function ToolbarWithDropdown({
	title,
	onChange,
	value,
	controls,
	controlset,
}) {
	const controlsets = {
		alignment: alignControls,
		all: alignControlsWithWidth,
	};

	if (controlset) {
		controls = controlsets[controlset];
	}

	if (controls) {
		return (
			<ToolbarGroup
				icon={controls.find((i) => i.value === value)?.icon}
				title={title}
				isCollapsed
				controls={controls.map((control) => {
					return {
						...control,
						onClick: () => onChange(control.value),
						isActive: value === control.value,
					};
				})}
			/>
		);
	}
	return null;
}
