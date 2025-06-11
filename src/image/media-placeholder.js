import { get } from "lodash";
import { __ } from "@wordpress/i18n";
import { Placeholder } from "@wordpress/components";
import { image as imageIcon } from "@wordpress/icons";
import { MediaPlaceholder } from "@wordpress/block-editor";

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
				icon={imageIcon}
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
			icon={imageIcon}
			accept="image/*"
			placeholder={placeholder}
			//  onError={onUploadError}
			onSelect={onSelectImage}
			//  onSelectURL={onSelectURL}
			allowedTypes={["image"]}
			value={id}
			//  mediaPreview={mediaPreview}
			//  disableMediaButtons={temporaryURL || url}
		/>
	);
}
export default CustomMediaPlaceholder;
