import { registerBlockType } from "@wordpress/blocks";
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";

import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";

import {
	PanelBody,
	SelectControl,
	ToolbarButton,
	ToolbarDropdownMenu,
} from "@wordpress/components";

import gradients from "../../utils/gradients";

const DEFAULT_GRADIENT = gradients[0]?.gradient || "";
const META_CLASS = "is-style-ud-meta";

const TEMPLATE = [["core/heading", { level: 3, placeholder: "Überschrift…" }]];

const CARD_WIDTH_OPTIONS = [
	{ label: "Standard (vom Grid)", value: "" },
	{ label: "280 px", value: "280px" },
	{ label: "320 px", value: "320px" },
	{ label: "360 px", value: "360px" },
	{ label: "400 px", value: "400px" },
	{ label: "440 px", value: "440px" },
	{ label: "480 px", value: "480px" },
	{ label: "800 px", value: "800px" },
];

const hasClassName = (className = "", targetClass = "") => {
	return className.split(/\s+/).filter(Boolean).includes(targetClass);
};

const toggleClassName = (className = "", targetClass = "", enabled = false) => {
	const classes = className.split(/\s+/).filter(Boolean);
	const filteredClasses = classes.filter((item) => item !== targetClass);

	if (enabled) {
		filteredClasses.push(targetClass);
	}

	return filteredClasses.join(" ");
};

const ParagraphMetaToolbar = ({ clientId, attributes, setAttributes }) => {
	const isInsideContentCard = useSelect(
		(select) => {
			const blockEditor = select("core/block-editor");
			const parentClientIds = blockEditor.getBlockParents(clientId);

			return parentClientIds.some((parentClientId) => {
				const parentBlock = blockEditor.getBlock(parentClientId);

				return (
					parentBlock?.name === "ud-betreuungsparadies/content-card"
				);
			});
		},
		[clientId]
	);

	if (!isInsideContentCard) {
		return null;
	}

	const className = attributes.className || "";
	const isMetaText = hasClassName(className, META_CLASS);

	return (
		<BlockControls group="block">
			<ToolbarButton
				label="Kleiner Text"
				icon={
					<span
						className="ud-toolbar-icon-small-text"
						aria-hidden="true"
					>
						Aa
					</span>
				}
				isPressed={isMetaText}
				onClick={() => {
					setAttributes({
						className:
							toggleClassName(
								className,
								META_CLASS,
								!isMetaText
							) || undefined,
					});
				}}
			/>
		</BlockControls>
	);
};

const withConditionalParagraphMetaToolbar = createHigherOrderComponent(
	(BlockEdit) => {
		return (props) => {
			if (props.name !== "core/paragraph") {
				return <BlockEdit {...props} />;
			}

			return (
				<>
					<BlockEdit {...props} />

					<ParagraphMetaToolbar
						clientId={props.clientId}
						attributes={props.attributes}
						setAttributes={props.setAttributes}
					/>
				</>
			);
		};
	},
	"withConditionalParagraphMetaToolbar"
);

addFilter(
	"editor.BlockEdit",
	"ud-betreuungsparadies/conditional-paragraph-meta-toolbar",
	withConditionalParagraphMetaToolbar
);

registerBlockType("ud-betreuungsparadies/content-card", {
	edit: function Edit({ attributes, setAttributes }) {
		const ALLOWED_BLOCKS = useSelect((select) => {
			const allBlocks = select("core/blocks").getBlockTypes();

			const udBlocks = allBlocks
				.map((block) => block.name)
				.filter((name) => name.startsWith("ud-betreuungsparadies/"));

			return [
				"core/heading",
				"core/paragraph",
				"core/list",
				"core/list-item",
				"core/image",
				"core/block",
				"core/group",
				"core/spacer",
				...udBlocks,
			];
		}, []);

		const { gradient = DEFAULT_GRADIENT, cardWidth = "" } = attributes;

		useEffect(() => {
			if (!attributes.gradient && DEFAULT_GRADIENT) {
				setAttributes({ gradient: DEFAULT_GRADIENT });
			}
		}, [attributes.gradient, setAttributes]);

		const blockProps = useBlockProps({
			className: "ud-content-card ud-betreuungsparadies-card",
			style: {
				...(gradient ? { background: gradient } : {}),
				...(cardWidth ? { "--ud-content-card-width": cardWidth } : {}),
			},
		});

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

				<InspectorControls>
					<PanelBody title="Kartenbreite" initialOpen={false}>
						<SelectControl
							label="Kartenbreite"
							help="Standard: Wird vom Card Grid übernommen. Optional kann diese Karte eine eigene Breite erhalten."
							value={cardWidth}
							options={CARD_WIDTH_OPTIONS}
							onChange={(value) =>
								setAttributes({ cardWidth: value })
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						templateLock={false}
					/>
				</div>
			</>
		);
	},

	save: function Save({ attributes }) {
		const { gradient = DEFAULT_GRADIENT, cardWidth = "" } = attributes;

		return (
			<div
				{...useBlockProps.save({
					className: "ud-content-card ud-betreuungsparadies-card",
					style: {
						...(gradient ? { background: gradient } : {}),
						...(cardWidth
							? { "--ud-content-card-width": cardWidth }
							: {}),
					},
				})}
			>
				<InnerBlocks.Content />
			</div>
		);
	},
});
