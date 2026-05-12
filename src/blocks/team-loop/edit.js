import { registerBlockType, parse } from "@wordpress/blocks";

import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from "@wordpress/components";

import { InspectorControls, useBlockProps } from "@wordpress/block-editor";

import { useSelect } from "@wordpress/data";

import { RawHTML } from "@wordpress/element";

import metadata from "./block.json";

const findBlock = (blocks, blockName) => {
	for (const block of blocks) {
		if (block.name === blockName) {
			return block;
		}

		const found = findBlock(block.innerBlocks || [], blockName);

		if (found) {
			return found;
		}
	}

	return null;
};

const getTeamHeroData = (rawContent = "") => {
	const blocks = parse(rawContent);
	const heroBlock = findBlock(blocks, "ud-betreuungsparadies/team-hero");

	if (!heroBlock) {
		return {
			imageUrl: "",
			gradient: "",
		};
	}

	const imageBlock = findBlock(heroBlock.innerBlocks || [], "core/image");

	return {
		imageUrl: imageBlock?.attributes?.url || "",
		gradient: heroBlock.attributes?.gradient || "",
	};
};

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { heading, standort, nurLeitung, leitungZuerst } = attributes;
		const terms = useSelect((select) => {
			return select("core").getEntityRecords(
				"taxonomy",
				"team_standort",
				{
					per_page: -1,
					hide_empty: false,
				}
			);
		}, []);

		const selectedTerm = (terms || []).find(
			(term) => term.slug === standort
		);
		const selectedTermId = selectedTerm?.id || null;

		const teamMembers = useSelect(
			(select) => {
				const query = {
					per_page: -1,
					context: "edit",
					orderby: "title",
					order: "asc",
				};

				if (selectedTermId) {
					query.team_standort = selectedTermId;
				}

				return select("core").getEntityRecords(
					"postType",
					"ud_team",
					query
				);
			},
			[selectedTermId, nurLeitung, leitungZuerst]
		);

		const filteredTeamMembers = (teamMembers || [])
			.filter((member) => {
				if (!nurLeitung) {
					return true;
				}

				return !!member.meta?.team_is_leitung;
			})
			.sort((a, b) => {
				if (!leitungZuerst) {
					return 0;
				}

				return (
					Number(!!b.meta?.team_is_leitung) -
					Number(!!a.meta?.team_is_leitung)
				);
			});

		const standortOptions = [
			{
				label: "Alle Standorte",
				value: "",
			},
			...(terms || []).map((term) => ({
				label: term.name,
				value: term.slug,
			})),
		];

		const blockProps = useBlockProps({
			className: "ud-team-loop-editor",
		});

		return (
			<>
				<InspectorControls>
					<PanelBody
						title="Team-Loop Einstellungen"
						initialOpen={true}
					>
						<TextControl
							label="Optionale Überschrift"
							value={heading}
							onChange={(value) =>
								setAttributes({ heading: value })
							}
							placeholder="z. B. Team Ibach"
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						<SelectControl
							label="Standort"
							value={standort}
							options={standortOptions}
							onChange={(value) =>
								setAttributes({ standort: value })
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						<ToggleControl
							label="Nur Mitglieder mit Leitungsfunktion anzeigen"
							checked={nurLeitung}
							onChange={(value) =>
								setAttributes({ nurLeitung: value })
							}
							__nextHasNoMarginBottom={true}
						/>

						<ToggleControl
							label="Mitglieder mit Leitungsfunktion zuerst ausgeben"
							checked={leitungZuerst}
							onChange={(value) =>
								setAttributes({ leitungZuerst: value })
							}
							__nextHasNoMarginBottom={true}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{heading && (
						<h2 className="ud-team-loop__heading">{heading}</h2>
					)}

					<div className="ud-team-loop-editor-preview">
						{!teamMembers && <p>Teammitglieder werden geladen…</p>}

						{teamMembers && filteredTeamMembers.length === 0 && (
							<p className="ud-team-loop-editor-preview__empty">
								Keine Teammitglieder für diese Auswahl gefunden.
							</p>
						)}

						{filteredTeamMembers.map((member) => {
							const { imageUrl, gradient } = getTeamHeroData(
								member.content?.raw || ""
							);

							const name = member.title?.rendered || "";
							const email = member.meta?.team_email || "";
							const emailLabel =
								member.meta?.team_email_label || name;

							return (
								<article
									className="ud-team-loop-editor-preview__item ud-betreuungsparadies-card"
									key={member.id}
									style={
										gradient
											? { background: gradient }
											: undefined
									}
								>
									{imageUrl && (
										<div className="ud-team-loop-card__media">
											<img
												className="ud-team-loop-card__image"
												src={imageUrl}
												alt=""
											/>
										</div>
									)}

									<div className="ud-team-loop-card__content">
										<h3 className="ud-team-loop-card__title">
											<RawHTML>{name}</RawHTML>
										</h3>

										<div className="ud-team-loop-card__links">
											{email && (
												<div className="ud-card-button ud-card-button--style-outline ud-card-button--email">
													<span className="ud-card-button__link">
														{emailLabel}
													</span>
												</div>
											)}

											<span className="ud-team-loop-card__more" />
										</div>
									</div>
								</article>
							);
						})}
					</div>
				</div>
			</>
		);
	},
});
