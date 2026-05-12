import { RichText, useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { text, isActive = true } = attributes;

	const blockProps = useBlockProps.save({
		className: `ud-card-chip ${isActive ? "is-active" : "is-inactive"}`,
	});

	return (
		<RichText.Content
			{...blockProps}
			tagName="span"
			value={text}
		/>
	);
}