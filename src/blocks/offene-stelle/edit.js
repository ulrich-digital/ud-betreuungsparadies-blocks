import { registerBlockType } from "@wordpress/blocks";

import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
} from "@wordpress/block-editor";

import {
	ToolbarButton,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from "@wordpress/components";

import { useEffect } from "@wordpress/element";
import { seen, unseen } from "@wordpress/icons";

import gradients from "../../utils/gradients";

import metadata from "./block.json";

const DEFAULT_GRADIENT = gradients[0]?.gradient || "";

const TEMPLATE = [
	[
		"core/paragraph",
		{
			content: "Paradies Kita Ibach/SZ oder Muotathal",
		},
	],
	[
		"core/heading",
		{
			level: 3,
			content: "Mitarbeitende Hauswirtschaft (60%)",
		},
	],
	[
		"core/paragraph",
		{
			content:
				"<strong>Wir suchen</strong> auf Januar 2025 oder nach Vereinbarung Mitarbeitende im Bereich Hauswirtschaft.",
		},
	],
	[
		"core/paragraph",
		{
			content:
				"<strong>Sie haben</strong> Erfahrung im Bereich Kochen und Reinigung und unterstützen das Kitateam von Montag bis Freitag oder an einzelnen Wochentagen beim Einkauf, der Zubereitung der Mittagsmahlzeiten und bei Reinigungsarbeiten.",
		},
	],
	[
		"core/paragraph",
		{
			content:
				"<strong>Wir bieten</strong> eine abwechslungsreiche Tätigkeit mit viel Gestaltungsfreiraum in einer familiären Kita mit fortschrittlichen Rahmenbedingungen.",
		},
	],
	[
		"core/paragraph",
		{
			content: "Auskünfte erteilt die Kitaleitung:",
		},
	],
	[
		"ud-betreuungsparadies/card-buttons",
		{
			buttonLayout: "vertical",
			layout: {
				type: "flex",
				flexWrap: "wrap",
				justifyContent: "left",
			},
		},
		[
			[
				"ud-betreuungsparadies/card-button",
				{
					linkMode: "contact",
					text: "Lea Siegwart",
					url: "lea.siegwart@betreuungsparadies.ch",
					buttonStyle: "outline",
				},
			],
			[
				"ud-betreuungsparadies/card-button",
				{
					linkMode: "contact",
					text: "041 810 31 13",
					url: "041 810 31 13",
					buttonStyle: "outline",
				},
			],
		],
	],
[
		"ud-betreuungsparadies/card-buttons",
		{
			buttonLayout: "vertical",
			layout: {
				type: "flex",
				flexWrap: "wrap",
				justifyContent: "left",
			},
		},
		[
			[
				"ud-betreuungsparadies/card-button",
				{
					linkMode: "contact",
					text: "Deborah Gwerder",
					url: "deborah.gwerder@betreuungsparadies.ch",
					buttonStyle: "outline",
				},
			],
			[
				"ud-betreuungsparadies/card-button",
				{
					linkMode: "contact",
					text: "041 888 00 49",
					url: "041 888 00 49",
					buttonStyle: "outline",
				},
			],
		],
	],
	[
		"core/paragraph",
		{
			content: "Ihre Bewerbung senden Sie an",
		},
	],
	[
		"ud-betreuungsparadies/card-buttons",
		{
			layout: {
				type: "flex",
				flexWrap: "wrap",
			},
		},
		[
			[
				"ud-betreuungsparadies/card-button",
				{
					linkMode: "contact",
					text: "Kita Ibach",
					url: "kita.ibach@betreuungsparadies.ch",
				},
			],
		],
	],
	[
		"ud-betreuungsparadies/card-buttons",
		{
			layout: {
				type: "flex",
				flexWrap: "wrap",
			},
		},
		[
			[
				"ud-betreuungsparadies/card-button",
				{
					linkMode: "contact",
					text: "Kita Muotathal",
					url: "kita.muotathal@betreuungsparadies.ch",
				},
			],
		],
	],
];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { isActive = true, gradient = DEFAULT_GRADIENT } = attributes;

		useEffect(() => {
			if (!attributes.gradient && DEFAULT_GRADIENT) {
				setAttributes({ gradient: DEFAULT_GRADIENT });
			}
		}, []);

		const blockProps = useBlockProps({
			className: [
				"ud-offene-stelle",
				"ud-betreuungsparadies-card",
				!isActive ? "is-inactive" : "",
			]
				.filter(Boolean)
				.join(" "),
			style: {
				...(gradient ? { background: gradient } : {}),
			},
		});

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={isActive ? seen : unseen}
							label={
								isActive
									? "Diese Stelle nicht publizieren"
									: "Diese Stelle publizieren"
							}
							isPressed={isActive}
							onClick={() =>
								setAttributes({ isActive: !isActive })
							}
						/>
					</ToolbarGroup>

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
								setAttributes({ gradient: item.gradient }),
							isActive: gradient === item.gradient,
						}))}
					/>
				</BlockControls>

				<div {...blockProps}>
					<InnerBlocks template={TEMPLATE} templateLock={false} />
				</div>
			</>
		);
	},

	save: function Save() {
		return <InnerBlocks.Content />;
	},
});
