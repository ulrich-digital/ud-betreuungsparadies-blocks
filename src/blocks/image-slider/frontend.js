import Splide from "@splidejs/splide";

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".ud-image-slider.splide").forEach((slider) => {
		if (slider.classList.contains("is-initialized")) {
			return;
		}

		const track = slider.querySelector(":scope > .splide__track");
		const list = track?.querySelector(":scope > .splide__list");

		if (!track || !list || list.children.length === 0) {
			return;
		}

		new Splide(slider, {
			type: "loop",
			perPage: 1,
			arrows: true,
			pagination: false,
			speed: 600,
		}).mount();
	});
});