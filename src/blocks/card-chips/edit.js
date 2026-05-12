import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const ALLOWED_BLOCKS = ["ud-betreuungsparadies/card-chip"];

registerBlockType("ud-betreuungsparadies/card-chips", {
	edit: function Edit() {
		const blockProps = useBlockProps({
			className: "ud-card-chips",
		});

		return (
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={[["ud-betreuungsparadies/card-chip"]]}
					templateLock={false}
					orientation="horizontal"
				/>
			</div>
		);
	},

	save: function Save() {
		return (
			<div {...useBlockProps.save({ className: "ud-card-chips" })}>
				<InnerBlocks.Content />
			</div>
		);
	},
});