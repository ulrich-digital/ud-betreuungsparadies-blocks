import { registerBlockType } from "@wordpress/blocks";
import { 	BlockControls, InnerBlocks, useBlockProps, RichText } from "@wordpress/block-editor";

import metadata from "./block.json";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { ToolbarDropdownMenu } from "@wordpress/components";

import gradients from "../../utils/gradients";
const DEFAULT_GRADIENT = gradients[0]?.gradient || "";

const getFirstColor = (gradient) => {
	if (!gradient) return "";

	const match = gradient.match(/linear-gradient\((.*)\)/);
	if (!match) return "";

	const parts = match[1].split(",");

	// erste Farbe nach der Richtung
	return parts[1]?.trim() || "";
};

const ALLOWED_BLOCKS = ["ud-betreuungsparadies/image-slide"];

const TEMPLATE = [
	["ud-betreuungsparadies/image-slide"],
	["ud-betreuungsparadies/image-slide"],
];


registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { title } = attributes;

		const { gradient = DEFAULT_GRADIENT } = attributes;
		useEffect(() => {
			if (!attributes.gradient && DEFAULT_GRADIENT) {
				setAttributes({ gradient: DEFAULT_GRADIENT });
			}
		}, []);

		const blockProps = useBlockProps({
			className: "ud-image-slider-wrapper",
			style: gradient ? { background: gradient } : undefined,
		});

		const titleBg = getFirstColor(gradient);

		return (
			<>
				<BlockControls>
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
									style={{ background: item.gradient }}
								/>
							),
							onClick: () =>
								setAttributes({ gradient: item.gradient }),
							isActive: gradient === item.gradient,
						}))}
					/>
				</BlockControls>
				<div {...blockProps}>
					<RichText
						tagName="h3"
						className="ud-image-slider__title"
	style={{ background: titleBg }}

						value={title}
						onChange={(value) => setAttributes({ title: value })}
						placeholder="Überschrift eingeben…"
						__next40pxDefaultSize={true}
						__nextHasNoMarginBottom={true}
					/>
					<div className="ud-image-slider splide">
						<div className="splide__arrows ud-image-slider__arrows">
							<button className="splide__arrow splide__arrow--prev ud-image-slider__arrow ud-image-slider__arrow--prev">
								<i
									className="fa-solid fa-circle-arrow-left"
									aria-hidden="true"
								></i>
								<span className="screen-reader-text">
									Vorheriges Bild
								</span>
							</button>

							<button className="splide__arrow splide__arrow--next ud-image-slider__arrow ud-image-slider__arrow--next">
								<i
									className="fa-solid fa-circle-arrow-right"
									aria-hidden="true"
								></i>
								<span className="screen-reader-text">
									Nächstes Bild
								</span>
							</button>
						</div>

						<div className="splide__track">
							<ul className="splide__list">
								<InnerBlocks
									allowedBlocks={ALLOWED_BLOCKS}
									template={TEMPLATE}
									templateLock={false}
									renderAppender={
										InnerBlocks.ButtonBlockAppender
									}
								/>
							</ul>
						</div>
					</div>
				</div>
			</>
		);
	},

	save: function Save({ attributes }) {
		const { title } = attributes;
		const { gradient = DEFAULT_GRADIENT } = attributes;

		const blockProps = useBlockProps.save({
			className: "ud-image-slider-wrapper",
			style: gradient ? { background: gradient } : undefined,
		});

		const titleBg = getFirstColor(gradient);

		return (
			<div {...blockProps}>
				{title && (
					<RichText.Content
						tagName="h3"
						className="ud-image-slider__title"
	style={{ background: titleBg }}

						value={title}
					/>
				)}

				<div className="ud-image-slider splide">
					<div className="splide__arrows ud-image-slider__arrows">
						<button className="splide__arrow splide__arrow--prev ud-image-slider__arrow ud-image-slider__arrow--prev">
							<i
								className="fa-solid fa-circle-arrow-left"
								aria-hidden="true"
							></i>
							<span className="screen-reader-text">
								Vorheriges Bild
							</span>
						</button>

						<button className="splide__arrow splide__arrow--next ud-image-slider__arrow ud-image-slider__arrow--next">
							<i
								className="fa-solid fa-circle-arrow-right"
								aria-hidden="true"
							></i>
							<span className="screen-reader-text">
								Nächstes Bild
							</span>
						</button>
					</div>

					<div className="splide__track">
						<ul className="splide__list">
							<InnerBlocks.Content />
						</ul>
					</div>
				</div>
			</div>
		);
	},
});
