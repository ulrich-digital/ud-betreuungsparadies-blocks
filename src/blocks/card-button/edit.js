import { registerBlockType } from "@wordpress/blocks";

import {
	BlockControls,
	LinkControl,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";
/*
import {
	Button,
	Popover,
	TextControl,
	ToolbarButton,
	ToolbarDropdownMenu,
	ToolbarGroup,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
*/
import {
	Button,
	Popover,
	TextControl,
	ToolbarButton,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from "@wordpress/components";

import { useRef, useState } from "@wordpress/element";

import { link } from "@wordpress/icons";

const iconButtonOutline = (
	<svg viewBox="0 0 24 24">
		<path d="M20.8,5.7c-.5-.6-1.3-1.1-2.2-1.1H4.9c-1.6,0-2.9,1.3-2.9,2.9v8.2c0,.8.3,1.5.9,2,.5,1,1.4,1.6,2.6,1.6h13.7c1.6,0,2.9-1.3,2.9-2.9v-8.5c0-1-.5-1.8-1.2-2.3ZM3.1,7.5c0-.9.8-1.7,1.7-1.7h13.7c.9,0,1.7.8,1.7,1.7v8.2c0,.9-.8,1.7-1.7,1.7H4.9c-.9,0-1.7-.8-1.7-1.7V7.5ZM14.4,9c-.2-.3-.6-.6-1-.8s-.9-.3-1.5-.3-1.1,0-1.5.3-.7.4-1,.8-.4.7-.4,1.1h0c0,0,1.4,0,1.4,0h0c0-.3.2-.6.5-.8s.6-.3,1-.3.8.1,1,.3.4.5.4.9v.5h-1.9c-.8.2-1.5.4-1.9.7s-.7.8-.7,1.5h0c0,.4,0,.8.3,1.1s.5.6.8.8.8.3,1.2.3.6,0,.9-.2.5-.2.7-.4.4-.4.5-.7h0v1.1h1.5v-4.9c0-.5-.1-.9-.3-1.2ZM13,13.3c-.2.2-.4.4-.6.6s-.6.2-.9.2-.7,0-.9-.3-.4-.4-.4-.7h0c0-.3.1-.6.4-.7s.6-.3,1-.3h1.7c0-.1,0,.4,0,.4,0,.3,0,.6-.2.8Z" />
	</svg>
);

const iconButtonFilled = (
	<svg viewBox="0 0 24 24">
		<path d="M20.8,5.7c-.5-.6-1.3-1.1-2.2-1.1H4.9c-1.6,0-2.9,1.3-2.9,2.9v8.2c0,.8.3,1.5.9,2,.5,1,1.4,1.6,2.6,1.6h13.7c1.6,0,2.9-1.3,2.9-2.9v-8.5c0-1-.5-1.8-1.2-2.3ZM14.7,15.1h-1.5v-1.1h0c-.1.3-.3.5-.5.7s-.5.3-.7.4-.6.2-.9.2c-.5,0-.9,0-1.2-.3s-.6-.4-.8-.8-.3-.7-.3-1.1h0c0-.6.2-1.1.7-1.5s1.1-.6,1.9-.6h1.9v-.6c0-.4-.1-.7-.4-.9s-.6-.3-1-.3-.7,0-1,.3-.4.4-.5.7h0c0,0-1.4,0-1.4,0h0c0-.5.2-.8.4-1.2s.6-.6,1-.8.9-.3,1.5-.3,1.1,0,1.5.3.7.5,1,.8.3.8.3,1.2v4.9Z" />
		<path d="M10.5,12.3c-.2.2-.4.4-.4.7h0c0,.3.1.6.4.7s.5.3.9.3.6,0,.9-.2.5-.3.6-.6c.2-.2.2-.5.2-.8v-.5h-1.7c-.4.1-.8.2-1,.4Z" />
	</svg>
);

const iconLinkModePage = (
	<svg viewBox="0 0 24 24">
		<path d="M5,4.5h14v15H5v-15ZM6.5,6v12h11V6h-11ZM8,8h8v1.3H8V8ZM8,11h8v1.3H8V11ZM8,14h5v1.3H8V14Z" />
	</svg>
);

const iconLinkModeDocument = (
	<svg viewBox="0 0 24 24">
		<path d="M6,3.5h8.5L19,8v12.5H6V3.5ZM13.8,5H7.5v14h10V8.7h-3.7V5ZM15.3,6.1v1.2h1.2l-1.2-1.2ZM9,11h7v1.3H9V11ZM9,14h7v1.3H9V14ZM9,17h4v1.3H9V17Z" />
	</svg>
);

const iconLinkModeContact = (
	<svg viewBox="0 0 24 24">
		<path d="M4,6h16v12H4V6ZM5.5,7.7v8.6h13V7.7l-6.5,4.8-6.5-4.8ZM7,7.5l5,3.7,5-3.7H7Z" />
	</svg>
);

function normalizeUrl(value = "") {
	const trimmedValue = value.trim();

	if (!trimmedValue) {
		return "";
	}

	if (trimmedValue.startsWith("mailto:") || trimmedValue.startsWith("tel:")) {
		return trimmedValue;
	}

	if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
		return `mailto:${trimmedValue}`;
	}

	const phoneCandidate = trimmedValue.replace(/\s+/g, "");

	if (/^0\d{8,}$/.test(phoneCandidate)) {
		return `tel:+41${phoneCandidate.substring(1)}`;
	}

	if (/^\+41\d{8,}$/.test(phoneCandidate)) {
		return `tel:${phoneCandidate}`;
	}

	return trimmedValue;
}

function isDocumentUrl(url = "") {
	const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();

	return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip)$/.test(cleanUrl);
}

function getLinkType(url = "") {
	if (url.startsWith("mailto:")) {
		return "email";
	}

	if (url.startsWith("tel:")) {
		return "phone";
	}

	if (isDocumentUrl(url)) {
		return "document";
	}

	if (url.startsWith("#") || url.startsWith("/")) {
		return "internal";
	}

	try {
		const linkUrl = new URL(url);
		const siteUrl = new URL(window.location.origin);

		if (linkUrl.hostname === siteUrl.hostname) {
			return "internal";
		}

		return "external";
	} catch (error) {
		return "internal";
	}
}

function isUrlCompatibleWithLinkMode(url = "", linkMode = "page") {
	const normalizedUrl = normalizeUrl(url);
	const linkType = getLinkType(normalizedUrl);

	if (!normalizedUrl) {
		return true;
	}

	if (linkMode === "document") {
		return linkType === "document";
	}

	if (linkMode === "contact") {
		return linkType === "email" || linkType === "phone";
	}

	return linkType === "internal" || linkType === "external";
}

registerBlockType("ud-betreuungsparadies/card-button", {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			text,
			url,
			buttonStyle = "filled",
			linkMode = "page",
		} = attributes;
		const normalizedUrl = normalizeUrl(url);
		const linkType = getLinkType(normalizedUrl);
		const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
		const buttonRef = useRef(null);

		const blockProps = useBlockProps({
			className: `ud-card-button ud-card-button--${linkType} ud-card-button--style-${buttonStyle}`,
		});

const updateLinkMode = (value) => {
	setAttributes({
		linkMode: value,
		url: isUrlCompatibleWithLinkMode(url, value) ? url : "",
	});
};

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							ref={buttonRef}
							icon={link}
							label="Link bearbeiten"
							isPressed={!!url}
							onClick={() =>
								setIsLinkPopoverOpen((value) => !value)
							}
						/>

						<ToolbarDropdownMenu
							icon={
								buttonStyle === "outline"
									? iconButtonOutline
									: iconButtonFilled
							}
							label="Button-Stil auswählen"
							controls={[
								{
									title: "Outline",
									icon: iconButtonOutline,
									isActive: buttonStyle === "outline",
									onClick: () =>
										setAttributes({
											buttonStyle: "outline",
										}),
								},
								{
									title: "Gefüllt",
									icon: iconButtonFilled,
									isActive: buttonStyle === "filled",
									onClick: () =>
										setAttributes({
											buttonStyle: "filled",
										}),
								},
							]}
						/>
					</ToolbarGroup>
				</BlockControls>

				{isLinkPopoverOpen && (
					<Popover
						anchor={buttonRef.current}
						placement="bottom"
						onClose={() => setIsLinkPopoverOpen(false)}
					>
						<div className="ud-card-button__link-popover">

<div className="ud-card-button__link-mode-buttons">
	<Button
		className="ud-card-button__link-mode-button"
		variant={linkMode === "page" ? "primary" : "secondary"}
		isPressed={linkMode === "page"}
		__next40pxDefaultSize={true}
		onClick={() => updateLinkMode("page")}
	>
		<span className="ud-card-button__link-mode-icon">
			{iconLinkModePage}
		</span>
		<span>Seite / URL</span>
	</Button>

	<Button
		className="ud-card-button__link-mode-button"
		variant={linkMode === "document" ? "primary" : "secondary"}
		isPressed={linkMode === "document"}
		__next40pxDefaultSize={true}
		onClick={() => updateLinkMode("document")}
	>
		<span className="ud-card-button__link-mode-icon">
			{iconLinkModeDocument}
		</span>
		<span>Datei / PDF</span>
	</Button>

	<Button
		className="ud-card-button__link-mode-button"
		variant={linkMode === "contact" ? "primary" : "secondary"}
		isPressed={linkMode === "contact"}
		__next40pxDefaultSize={true}
		onClick={() => updateLinkMode("contact")}
	>
		<span className="ud-card-button__link-mode-icon">
			{iconLinkModeContact}
		</span>
		<span>E-Mail / Telefon</span>
	</Button>
</div>
							{linkMode === "page" && (
								<LinkControl
									value={{ url }}
									onChange={(value) =>
										setAttributes({
											url: value?.url || "",
										})
									}
									settings={[]}
								/>
							)}

							{linkMode === "document" && (
								<Button
									className="ud-card-button__media-button"
									variant="secondary"
									__next40pxDefaultSize={true}
									onClick={() => {
										const frame = wp.media({
											title: "Datei auswählen",
											button: {
												text: "Datei übernehmen",
											},
											multiple: false,
										});

										frame.on("select", () => {
											const attachment = frame
												.state()
												.get("selection")
												.first()
												.toJSON();

											setAttributes({
												url: attachment?.url || "",
											});
										});

										frame.open();
									}}
								>
									{url ? "Datei ändern" : "Datei auswählen"}
								</Button>
							)}

							{linkMode === "contact" && (
								<TextControl
									value={url}
									onChange={(value) =>
										setAttributes({
											url: value || "",
										})
									}
									placeholder="E-Mail-Adresse oder Telefonnummer eingeben"
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
							)}
						</div>
					</Popover>
				)}

				<div {...blockProps}>
					<span className="ud-card-button__link">
						<RichText
							tagName="span"
							value={text}
							onChange={(value) => setAttributes({ text: value })}
							placeholder="Text hinzufügen ..."
							allowedFormats={[]}
						/>
					</span>
				</div>
			</>
		);
	},
	save: function Save({ attributes }) {
		const { text, url, buttonStyle = "filled" } = attributes;
		const normalizedUrl = normalizeUrl(url);
		const linkType = getLinkType(normalizedUrl);
		const isExternal = linkType === "external";
		const isDocument = linkType === "document";

		if (!text || !normalizedUrl) {
			return null;
		}

		return (
			<div
				{...useBlockProps.save({
					className: `ud-card-button ud-card-button--${linkType} ud-card-button--style-${buttonStyle}`,
				})}
			>
				<a
					className="ud-card-button__link"
					href={normalizedUrl}
					{...(isExternal || isDocument
						? {
								target: "_blank",
								rel: "noopener noreferrer",
							}
						: {})}
				>
					<RichText.Content tagName="span" value={text} />
				</a>
			</div>
		);
	},
});
