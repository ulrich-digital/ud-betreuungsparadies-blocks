import { registerBlockType } from "@wordpress/blocks";
import {
	BlockControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	useBlockProps,
} from "@wordpress/block-editor";

import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { id, url, alt } = attributes;

		const blockProps = useBlockProps({
			className: "ud-image-slide splide__slide",
		});

		const onSelectImage = (media) => {
			setAttributes({
				id: media.id,
				url: media.url,
				alt: media.alt || "",
			});
		};

		return (
			<li {...blockProps}>
				{url && (
					<BlockControls group="inline">
						<MediaReplaceFlow
							mediaId={id}
							mediaURL={url}
							allowedTypes={["image"]}
							accept="image/*"
							onSelect={onSelectImage}
						/>
					</BlockControls>
				)}

				{url ? (
					<img src={url} alt={alt} />
				) : (
					<MediaPlaceholder
						icon="format-image"
						labels={{
							title: "Bildslide",
							instructions: "Bild für diesen Slide auswählen.",
						}}
						allowedTypes={["image"]}
						accept="image/*"
						onSelect={onSelectImage}
					/>
				)}
			</li>
		);
	},

	save: function Save({ attributes }) {
		const { url, alt } = attributes;

		if (!url) {
			return null;
		}

		const blockProps = useBlockProps.save({
			className: "ud-image-slide splide__slide",
		});

		return (
			<li {...blockProps}>
				<img src={url} alt={alt} />
			</li>
		);
	},
});