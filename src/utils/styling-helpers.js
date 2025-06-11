import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import { __experimentalHasSplitBorders as hasSplitBorders } from "@wordpress/components";

export const getBorderCSS = (object) => {
	let borders = {};

	if (!hasSplitBorders(object)) {
		borders["top"] = object;
		borders["right"] = object;
		borders["bottom"] = object;
		borders["left"] = object;
		return borders;
	}
	return object;
};

export function getSingleSideBorderValue(border, side) {
	const { width = "", style = "", color = "" } = border[side] || {};
	if (isEmpty(width)) {
		return "";
	}
	const borderWidth = width || "0";
	const borderStyle = isEmpty(style) ? "solid" : style;

	return `${borderWidth} ${borderStyle} ${color}`;
}

export function getBorderVariablesCss(border, slug) {
	const borderInFourDimension = getBorderCSS(border);
	const borderSides = ["top", "right", "bottom", "left"];
	let borders = {};
	for (let i = 0; i < borderSides.length; i++) {
		const side = borderSides[i];
		const sideProperty = `--galleryberg-${slug}-border-${side}`;
		const sideValue = getSingleSideBorderValue(borderInFourDimension, side);
		borders[sideProperty] = sideValue;
	}

	return borders;
}
/**
 *  Check values are mixed.
 * @param {any} values - value string or object
 * @returns true | false
 */
export function hasMixedValues(values = {}) {
	return typeof values === "string";
}
export function splitBorderRadius(value) {
	const isValueMixed = hasMixedValues(value);
	const splittedBorderRadius = {
		topLeft: value,
		topRight: value,
		bottomLeft: value,
		bottomRight: value,
	};
	return isValueMixed ? splittedBorderRadius : value;
}

/**
 * Checks is given value is a spacing preset.
 *
 * @param {string} value Value to check
 *
 * @return {boolean} Return true if value is string in format var:preset|spacing|.
 */
export function isValueSpacingPreset(value) {
	if (!value?.includes) {
		return false;
	}
	return value === "0" || value.includes("var:preset|spacing|");
}

/**
 * Converts a spacing preset into a custom value.
 *
 * @param {string} value Value to convert.
 *
 * @return {string | undefined} CSS var string for given spacing preset value.
 */
export function getSpacingPresetCssVar(value) {
	if (!value) {
		return;
	}

	const slug = value.match(/var:preset\|spacing\|(.+)/);

	if (!slug) {
		return value;
	}

	return `var(--wp--preset--spacing--${slug[1]})`;
}

export function getSpacingCss(object) {
	let css = {};
	for (const [key, value] of Object.entries(object)) {
		if (isValueSpacingPreset(value)) {
			css[key] = getSpacingPresetCssVar(value);
		} else {
			css[key] = value;
		}
	}
	return css;
}
export function generateStyles(styles) {
	return omitBy(
		styles,
		(value) =>
			value === false ||
			isEmpty(value) ||
			isUndefined(value) ||
			trim(value) === "" ||
			trim(value) === "undefined undefined undefined",
	);
}
