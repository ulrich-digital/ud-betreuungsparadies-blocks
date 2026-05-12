import { registerBlockType } from "@wordpress/blocks";
import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
} from "@wordpress/block-editor";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";

import metadata from "./block.json";

const ALLOWED_BLOCKS = ["ud-betreuungsparadies/card-button"];

const TEMPLATE = [["ud-betreuungsparadies/card-button"]];

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

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			buttonLayout = "horizontal",
			layout = {},
		} = attributes;

		const justifyContent = layout.justifyContent || "left";

		const blockProps = useBlockProps({
			className: [
				"ud-card-buttons",
				`ud-card-buttons--${buttonLayout}`,
				`is-content-justification-${justifyContent}`,
			].join(" "),
		});

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={iconColumns}
							label="Nebeneinander"
							isPressed={buttonLayout === "horizontal"}
							onClick={() =>
								setAttributes({ buttonLayout: "horizontal" })
							}
						/>

						<ToolbarButton
							icon={iconRows}
							label="Untereinander"
							isPressed={buttonLayout === "vertical"}
							onClick={() =>
								setAttributes({ buttonLayout: "vertical" })
							}
						/>
					</ToolbarGroup>
				</BlockControls>

				<div {...blockProps}>
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						templateLock={false}
						orientation={
							buttonLayout === "horizontal"
								? "horizontal"
								: "vertical"
						}
					/>
				</div>
			</>
		);
	},

	save: function Save({ attributes }) {
		const {
			buttonLayout = "horizontal",
			layout = {},
		} = attributes;

		const justifyContent = layout.justifyContent || "left";

		return (
			<div
				{...useBlockProps.save({
					className: [
						"ud-card-buttons",
						`ud-card-buttons--${buttonLayout}`,
						`is-content-justification-${justifyContent}`,
					].join(" "),
				})}
			>
				<InnerBlocks.Content />
			</div>
		);
	},
});
