import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl, RangeControl } from "@wordpress/components";
import metadata from "./block.json";

const ALLOWED_BLOCKS = [
	"ud-betreuungsparadies/content-card",
	"ud-betreuungsparadies/image-slider",
	"ud-betreuungsparadies/team-loop",
	"ud-betreuungsparadies/offene-stelle",
	"core/block",
	"core/spacer",
];

const getGridClassName = ({ cardAlignment, layoutMode }) =>
	[
		"ud-card-grid",
		layoutMode === "cardWidth"
			? `ud-card-grid--align-${cardAlignment}`
			: "",
		layoutMode === "columns" ? "ud-card-grid--columns" : "",
		layoutMode === "masonry" ? "ud-card-grid--masonry" : "",
	]
		.filter(Boolean)
		.join(" ");

const getGridStyle = ({ layoutMode, columns, cardWidth }) => {
	if (layoutMode === "columns") {
		return {
			"--ud-card-grid-columns": columns,
		};
	}

	return {
		"--ud-card-grid-min-width": cardWidth,
	};
};

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { layoutMode, columns, cardWidth, cardAlignment } = attributes;
		const isVerticalLayout =
			layoutMode === "columns" || layoutMode === "masonry";

		const blockProps = useBlockProps({
			className: getGridClassName({
				cardAlignment,
				layoutMode,
			}),
			style: getGridStyle({
				layoutMode,
				columns,
				cardWidth,
			}),
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: "ud-card-grid__inner",
			},
			{
				allowedBlocks: ALLOWED_BLOCKS,
				orientation: isVerticalLayout ? "vertical" : "horizontal",
			}
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Grid-Einstellungen" initialOpen={true}>
						<SelectControl
							label="Layout"
							value={layoutMode}
							options={[
								{ label: "Normal", value: "cardWidth" },
								{ label: "Masonry", value: "masonry" },
								{ label: "Spaltenanzahl", value: "columns" },
							]}
							onChange={(value) =>
								setAttributes({
									layoutMode: value,
									cardAlignment:
										value === "cardWidth"
											? cardAlignment
											: "stretch",
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						{(layoutMode === "cardWidth" ||
							layoutMode === "masonry") && (
							<>
								<SelectControl
									label={
										layoutMode === "masonry"
											? "Masonry-Spaltenbreite"
											: "Kartenbreite"
									}
									value={cardWidth}
									options={[
										{ label: "280 px", value: "280px" },
										{ label: "320 px", value: "320px" },
										{ label: "360 px", value: "360px" },
										{ label: "400 px", value: "400px" },
										{ label: "440 px", value: "440px" },
										{ label: "540 px", value: "540px" },
										{ label: "800 px", value: "800px" },
									]}
									onChange={(value) =>
										setAttributes({ cardWidth: value })
									}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>

								{layoutMode === "masonry" && (
									<p className="components-base-control__help">
										Individuelle Kartenbreiten werden im
										Masonry-Layout nicht berücksichtigt.
									</p>
								)}
							</>
						)}

						{layoutMode === "columns" && (
							<RangeControl
								label="Spalten"
								value={columns}
								onChange={(value) =>
									setAttributes({ columns: value })
								}
								min={1}
								max={4}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}

						{layoutMode === "cardWidth" && (
							<SelectControl
								label="Kartenausrichtung"
								value={cardAlignment}
								options={[
									{ label: "Gestreckt", value: "stretch" },
									{
										label: "Oben ausgerichtet",
										value: "start",
									},
								]}
								onChange={(value) =>
									setAttributes({ cardAlignment: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},

	save: function Save({ attributes }) {
		const { layoutMode, columns, cardWidth, cardAlignment } = attributes;

		return (
			<div
				{...useBlockProps.save({
					className: getGridClassName({
						cardAlignment,
						layoutMode,
					}),
					style: getGridStyle({
						layoutMode,
						columns,
						cardWidth,
					}),
				})}
			>
				<InnerBlocks.Content />
			</div>
		);
	},

	/*
	deprecated: [
		{
			attributes: metadata.attributes,

			save: function Save({ attributes }) {
				const { layoutMode, columns, cardWidth, cardAlignment } = attributes;

				return (
					<div
						{...useBlockProps.save({
							className: getGridClassName({
								cardAlignment,
								layoutMode,
							}),
							style: getGridStyle({
								layoutMode,
								columns,
								cardWidth,
							}),
						})}
					>
						<div className="ud-card-grid__inner">
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		},
	],
	*/
});