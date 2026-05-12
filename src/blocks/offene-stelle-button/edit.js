import { registerBlockType } from "@wordpress/blocks";

import {
	BlockControls,
	LinkControl,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";

import {
	Popover,
	ToolbarButton,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from "@wordpress/components";

import { useEffect, useRef, useState } from "@wordpress/element";
import { link } from "@wordpress/icons";

import gradients from "../../utils/gradients";

import metadata from "./block.json";

const DEFAULT_GRADIENT = gradients[0]?.gradient || "";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			text = "Offene Stellen",
			url = "/offene-stellen/",
			gradient = DEFAULT_GRADIENT,
		} = attributes;

		const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
		const buttonRef = useRef(null);

		useEffect(() => {
			if (!attributes.gradient && DEFAULT_GRADIENT) {
				setAttributes({ gradient: DEFAULT_GRADIENT });
			}
		}, []);

		const blockProps = useBlockProps({
			className:
				"ud-offene-stellen-button ud-card-button ud-card-button--internal ud-card-button--style-filled",
		});

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							ref={buttonRef}
							icon={link}
							label="Link bearbeiten"
							isPressed={isLinkPopoverOpen}
							onClick={() =>
								setIsLinkPopoverOpen((value) => !value)
							}
						/>

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

				{isLinkPopoverOpen && (
					<Popover
						anchor={buttonRef.current}
						placement="bottom"
						onClose={() => setIsLinkPopoverOpen(false)}
					>
						<div className="ud-offene-stellen-button__link-popover">
							<LinkControl
								value={{ url }}
								onChange={(value) =>
									setAttributes({
										url: value?.url || "",
									})
								}
								settings={[]}
							/>
						</div>
					</Popover>
				)}

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
