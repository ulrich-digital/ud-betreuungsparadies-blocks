import { registerBlockType } from "@wordpress/blocks";
import {
	BlockControls,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";

import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { label, value, layout } = attributes;

		const blockProps = useBlockProps({
			className: `ud-info-list ud-info-list--${layout}`,
		});

		const iconColumns = (
			<svg viewBox="0 0 24 24">
				<rect x="6" y="4" width="4" height="16" fill="currentColor" />
				<rect x="14" y="4" width="4" height="16" fill="currentColor" />
			</svg>
		);

		const iconRows = (
			<svg viewBox="0 0 24 24">
				<rect x="4" y="6" width="16" height="4" fill="currentColor" />
				<rect x="4" y="14" width="16" height="4" fill="currentColor" />
			</svg>
		);

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={iconColumns}
							label="Nebeneinander"
							isPressed={layout === "split"}
							onClick={() => setAttributes({ layout: "split" })}
						/>

						<ToolbarButton
							icon={iconRows}
							label="Untereinander"
							isPressed={layout === "stacked"}
							onClick={() => setAttributes({ layout: "stacked" })}
						/>
					</ToolbarGroup>
				</BlockControls>

				<div {...blockProps}>
					<RichText
						tagName="p"
						className="ud-info-list__label"
						placeholder="Label…"
						value={label}
						onChange={(newLabel) =>
							setAttributes({ label: newLabel })
						}
						allowedFormats={[]}
						withoutInteractiveFormatting
					/>

					<RichText
						tagName="p"
						className="ud-info-list__value"
						placeholder="Wert…"
						value={value}
						onChange={(newValue) =>
							setAttributes({ value: newValue })
						}
						allowedFormats={[]}
						withoutInteractiveFormatting
					/>
				</div>
			</>
		);
	},

	save: function Save({ attributes }) {
		const { label, value, layout } = attributes;

		return (
			<div
				{...useBlockProps.save({
					className: `ud-info-list ud-info-list--${layout}`,
				})}
			>
				<RichText.Content
					tagName="p"
					className="ud-info-list__label"
					value={label}
				/>

				<RichText.Content
					tagName="p"
					className="ud-info-list__value"
					value={value}
				/>
			</div>
		);
	},
});
