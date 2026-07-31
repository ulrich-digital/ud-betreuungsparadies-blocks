import { registerBlockType } from "@wordpress/blocks";

import {
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";

import {
	PanelBody,
	SelectControl,
	TextControl,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from "@wordpress/components";

import { useEffect } from "@wordpress/element";

import gradients from "../../utils/gradients";

import metadata from "./block.json";

const DEFAULT_GRADIENT = gradients[0]?.gradient || "";

const TARGET_TYPE_JOBS = "jobs";
const TARGET_TYPE_CUSTOM = "custom";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			targetType = TARGET_TYPE_JOBS,
			text = "Offene Stellen",
			url = "/offene-stellen/",
			gradient = DEFAULT_GRADIENT,
		} = attributes;

		useEffect(() => {
			if (!attributes.gradient && DEFAULT_GRADIENT) {
				setAttributes({ gradient: DEFAULT_GRADIENT });
			}
		}, []);

		const blockProps = useBlockProps({
			className:
				"ud-fokus-button ud-card-button ud-card-button--internal ud-card-button--style-filled",
		});

		const updateTargetType = (newTargetType) => {
			if (newTargetType === TARGET_TYPE_JOBS) {
				setAttributes({
					targetType: TARGET_TYPE_JOBS,
					text: "Offene Stellen",
					url: "/offene-stellen/",
				});

				return;
			}

			setAttributes({
				targetType: TARGET_TYPE_CUSTOM,
				text: text === "Offene Stellen" ? "Herbst Angebot" : text,
				url: url === "/offene-stellen/" ? "#herbstangebot" : url,
			});
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title="Fokus-Button" initialOpen={true}>
						<SelectControl
							label="Zieltyp"
							value={targetType}
							options={[
								{
									label: "Offene Stellen",
									value: TARGET_TYPE_JOBS,
								},
								{
									label: "Eigener Link",
									value: TARGET_TYPE_CUSTOM,
								},
							]}
							onChange={updateTargetType}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						{targetType === TARGET_TYPE_CUSTOM && (
							<TextControl
								label="Ziel-Link"
								help="Zum Beispiel /kontakt/ oder #herbstangebot"
								value={url}
								onChange={(newUrl) =>
									setAttributes({ url: newUrl })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}
					</PanelBody>
				</InspectorControls>

				<BlockControls>
					<ToolbarGroup>
						<ToolbarDropdownMenu
							icon={
								<span
									className="ud-gradient-toolbar-swatch"
									style={{ background: gradient }}
								/>
							}
							label="Farbvariante wählen"
							controls={gradients.map((item) => ({
								title: item.name,
								icon: (
									<span
										className="ud-gradient-toolbar-swatch"
										style={{ background: item.gradient }}
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
					<a
						className="ud-card-button__link"
						href={url || "#"}
						style={{
							...(gradient ? { background: gradient } : {}),
						}}
						onClick={(event) => event.preventDefault()}
					>
						<RichText
							tagName="span"
							value={text}
							placeholder="Button-Text"
							allowedFormats={[]}
							onChange={(newText) =>
								setAttributes({ text: newText })
							}
						/>
					</a>
				</div>
			</>
		);
	},

	save: function Save() {
		return null;
	},
});