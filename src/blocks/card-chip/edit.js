import { registerBlockType } from "@wordpress/blocks";



import {
	RichText,
	useBlockProps,
	BlockControls,
} from "@wordpress/block-editor";

import { ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { seen, unseen } from "@wordpress/icons";

import metadata from "./block.json";
import save from "./save";
function Edit({ attributes, setAttributes }) {
	const { text, isActive = true } = attributes;

	const blockProps = useBlockProps({
		className: `ud-card-chip ${isActive ? "is-active" : "is-inactive"}`,
	});

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={isActive ? seen : unseen}
						label={isActive ? "Verfügbar" : "Nicht verfügbar"}
						title={isActive ? "Verfügbar" : "Nicht verfügbar"}
						isPressed={isActive}
						onClick={() => setAttributes({ isActive: !isActive })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<RichText
				{...blockProps}
				tagName="span"
				value={text}
				placeholder="Chip Text"
				onChange={(value) => setAttributes({ text: value })}
				allowedFormats={[]}
				withoutInteractiveFormatting
			/>
		</>
	);
}

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
