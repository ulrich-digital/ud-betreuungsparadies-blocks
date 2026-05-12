document.addEventListener("DOMContentLoaded", () => {
	const revealImages = document.querySelectorAll(
		".wp-block-image.is-style-ud-scroll-reveal-image"
	);

	if (!revealImages.length) {
		return;
	}

	const observer = new IntersectionObserver(
		(entries, observerInstance) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add("is-visible");
				observerInstance.unobserve(entry.target);
			});
		},
		{
			threshold: 0.2,
		}
	);

	revealImages.forEach((image) => {
		observer.observe(image);
	});
});