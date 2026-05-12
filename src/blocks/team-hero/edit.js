import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

import gradients from "../../utils/gradients";
import metadata from "./block.json";

const ALLOWED_BLOCKS = ["core/image", "ud-betreuungsparadies/content-card"];

const DEFAULT_GRADIENT = gradients[0]?.gradient || "";

const TEMPLATE = [
	["core/image"],
	[
		"ud-betreuungsparadies/content-card",
		{
			className: "is-overlay",
		},
	],
];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { gradient = "" } = attributes;

		const standortSlug = useSelect((select) => {
			const postType = select("core/editor").getCurrentPostType();

			if (postType !== "ud_team") return null;

			const termIds =
				select("core/editor").getEditedPostAttribute("team_standort");

			const terms = select("core").getEntityRecords(
				"taxonomy",
				"team_standort",
				{ per_page: -1 }
			);

			if (!termIds || !terms) return null;

			const term = terms.find((t) => t.id === termIds[0]);

			return term?.slug || null;
		}, []);

		const computedGradient =
			gradients.find((g) => g.slug === standortSlug)?.gradient ||
			DEFAULT_GRADIENT;

		useEffect(() => {
			if (computedGradient && gradient !== computedGradient) {
				setAttributes({ gradient: computedGradient });
			}
		}, [computedGradient, gradient]);

		const blockProps = useBlockProps({
			className: "ud-team-hero alignwide",
			style: {
				"--ud-team-hero-gradient": gradient || computedGradient,
			},
		});

		return (
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={TEMPLATE}
					templateLock={false}
				/>
			</div>
		);
	},

	save: function Save({ attributes }) {
		const { gradient = DEFAULT_GRADIENT } = attributes;

		const blockProps = useBlockProps.save({
			className: "ud-team-hero alignwide",
			style: {
				"--ud-team-hero-gradient": gradient || DEFAULT_GRADIENT,
			},
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});