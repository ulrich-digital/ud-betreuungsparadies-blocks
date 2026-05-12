import { TextControl, ToggleControl } from "@wordpress/components";
import { useEntityProp } from "@wordpress/core-data";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { registerPlugin } from "@wordpress/plugins";
function TeamMetaPanel() {
	const [meta, setMeta] = useEntityProp("postType", "ud_team", "meta");
	const currentMeta = meta || {};

	return (

<PluginDocumentSettingPanel
	name="ud-team-meta"
	title="Teamangaben"
	className="ud-team-meta-panel"
>
	<div className="ud-team-meta-panel__fields">
		<ToggleControl
			label="Leitungsfunktion"
			checked={!!currentMeta.team_is_leitung}
			onChange={(value) =>
				setMeta({
					...currentMeta,
					team_is_leitung: !!value,
				})
			}
			__nextHasNoMarginBottom={true}
		/>
		<TextControl
			label="E-Mail-Adresse"
			type="email"
			value={currentMeta.team_email || ""}
			onChange={(value) =>
				setMeta({
					...currentMeta,
					team_email: value,
				})
			}
			__next40pxDefaultSize={true}
			__nextHasNoMarginBottom={true}
		/>

		<TextControl
			label="E-Mail-Linktext"
			help="Optional. Wenn leer, wird der Beitragsname verwendet."
			value={currentMeta.team_email_label || ""}
			onChange={(value) =>
				setMeta({
					...currentMeta,
					team_email_label: value,
				})
			}
			__next40pxDefaultSize={true}
			__nextHasNoMarginBottom={true}
		/>
	</div>
</PluginDocumentSettingPanel>
	);
}

registerPlugin("ud-team-meta-panel", {
	render: TeamMetaPanel,
});
