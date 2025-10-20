export function defaultColumnsNumber(imageCount) {
	return imageCount ? Math.min(3, imageCount) : 3;
}
