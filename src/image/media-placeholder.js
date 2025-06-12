import { get } from "lodash";
import { __ } from "@wordpress/i18n";
import { Placeholder } from "@wordpress/components";
import { MediaPlaceholder } from "@wordpress/block-editor";
import { blockIcon } from "./block-icon";

function CustomMediaPlaceholder(props) {
	const {
		attributes: { media },
		setAttributes,
	} = props;

	const placeholder = (content) => {
		return (
			<Placeholder
				className={"block-editor-media-placeholder"}
				withIllustration={true}
				icon={blockIcon}
				label={__("Image", "galleryberg-gallery-block")}
				instructions={__(
					"Upload an image file, pick one from your media library, or add one with a URL.",
				)}
			>
				{content}
			</Placeholder>
		);
	};
	function onSelectImage(media) {
		if (!media || !media.url) {
			setAttributes({
				media: {},
			});
		} else {
			let alt = media.alt;
			setAttributes({ media, alt });
		}
	}
	const id = get(media, "id", -1);
	return (
		<MediaPlaceholder
			icon={blockIcon}
			accept="image/*"
			placeholder={placeholder}
			onSelect={onSelectImage}
			allowedTypes={["image"]}
			value={id}
		/>
	);
}
export default CustomMediaPlaceholder;
