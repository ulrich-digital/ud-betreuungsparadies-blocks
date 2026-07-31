import { registerBlockType } from "@wordpress/blocks";
import {
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from "@wordpress/block-editor";

import { useEffect } from "@wordpress/element";

import {
	Button,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from "@wordpress/components";

import gradients from "../../utils/gradients";
import metadata from "./block.json";

import "./editor.scss";
import "./frontend.scss";

const DEFAULT_GRADIENT = gradients[0]?.gradient || "";

const IMAGE_SLOTS = [
	{
		key: "Large",
		label: "Grosses Bild",
		className: "ud-kita-gallery-grid__item--large",
	},
	{
		key: "Tall",
		label: "Hohes Bild",
		className: "ud-kita-gallery-grid__item--tall",
	},
	{
		key: "SmallTop",
		label: "Kleines Bild oben",
		className: "ud-kita-gallery-grid__item--small-top",
	},
	{
		key: "SmallBottom",
		label: "Kleines Bild unten",
		className: "ud-kita-gallery-grid__item--small-bottom",
	},
	{
		key: "NormalLeft",
		label: "Bild unten links",
		className: "ud-kita-gallery-grid__item--normal-left",
	},
	{
		key: "NormalMiddle",
		label: "Bild unten Mitte",
		className: "ud-kita-gallery-grid__item--normal-middle",
	},
	{
		key: "Wide",
		label: "Breites Bild",
		className: "ud-kita-gallery-grid__item--wide",
	},
];

const getAttributeName = (slotKey, property) => {
	return `image${slotKey}${property}`;
};

const getImageData = (attributes, slotKey) => {
	return {
		id: attributes[getAttributeName(slotKey, "Id")] || 0,
		url: attributes[getAttributeName(slotKey, "Url")] || "",
		alt: attributes[getAttributeName(slotKey, "Alt")] || "",
	};
};

const getImageUrl = (media) => {
	return (
		media?.sizes?.large?.url || media?.sizes?.full?.url || media?.url || ""
	);
};

const createImageAttributes = (slotKey, media) => {
	return {
		[getAttributeName(slotKey, "Id")]: media?.id || 0,
		[getAttributeName(slotKey, "Url")]: getImageUrl(media),
		[getAttributeName(slotKey, "Alt")]: media?.alt || "",
	};
};

const createEmptyImageAttributes = (slotKey) => {
	return {
		[getAttributeName(slotKey, "Id")]: 0,
		[getAttributeName(slotKey, "Url")]: "",
		[getAttributeName(slotKey, "Alt")]: "",
	};
};

registerBlockType(metadata.name, {
	...metadata,

	edit: function Edit({ attributes, setAttributes }) {
		const { gradient = DEFAULT_GRADIENT } = attributes;

		useEffect(() => {
			if (!attributes.gradient && DEFAULT_GRADIENT) {
				setAttributes({ gradient: DEFAULT_GRADIENT });
			}
		}, [attributes.gradient, setAttributes]);

		const blockProps = useBlockProps({
			className: "ud-kita-gallery-grid alignfull",
		});

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarDropdownMenu
							icon={
								<span
									className="ud-gradient-toolbar-swatch"
									style={{ background: gradient }}
								/>
							}
							label="Gradient wählen"
							controls={gradients.map((item) => ({
								title: item.name,
								icon: (
									<span
										className="ud-gradient-toolbar-swatch"
										style={{
											background: item.gradient,
										}}
									/>
								),
								onClick: () =>
									setAttributes({
										gradient: item.gradient,
									}),
								isActive: gradient === item.gradient,
							}))}
						/>
					</ToolbarGroup>
				</BlockControls>

				<div {...blockProps}>
					{IMAGE_SLOTS.map((slot) => {
						const image = getImageData(attributes, slot.key);

						return (
							<figure
								className={[
									"ud-kita-gallery-grid__item",
									slot.className,
								].join(" ")}
								style={
									gradient
										? { background: gradient }
										: undefined
								}
								key={slot.key}
							>
								<MediaUploadCheck>
									<MediaUpload
										allowedTypes={["image"]}
										value={image.id}
										onSelect={(media) =>
											setAttributes(
												createImageAttributes(
													slot.key,
													media
												)
											)
										}
										render={({ open }) => (
											<div className="ud-kita-gallery-grid__dropzone">
												{image.url ? (
													<>
														<img
															className="ud-kita-gallery-grid__image"
															src={image.url}
															alt={image.alt}
														/>

														<div className="ud-kita-gallery-grid__actions">
															<Button
																variant="secondary"
																onClick={open}
																__next40pxDefaultSize={
																	true
																}
															>
																Bild ersetzen
															</Button>

															<Button
																variant="tertiary"
																onClick={() =>
																	setAttributes(
																		createEmptyImageAttributes(
																			slot.key
																		)
																	)
																}
																__next40pxDefaultSize={
																	true
																}
															>
																Entfernen
															</Button>
														</div>
													</>
												) : (
													<Button
														className="ud-kita-gallery-grid__placeholder"
														variant="secondary"
														onClick={open}
														__next40pxDefaultSize={
															true
														}
													>
														{slot.label}
													</Button>
												)}
											</div>
										)}
									/>
								</MediaUploadCheck>
							</figure>
						);
					})}
				</div>
			</>
		);
	},

	save: function Save() {
		return null;
	},
});
