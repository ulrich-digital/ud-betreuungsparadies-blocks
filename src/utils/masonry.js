const isBlockEditor = () => {
	return (
		document.body.classList.contains("block-editor-page") ||
		document.body.classList.contains("site-editor-php") ||
		document.querySelector(".block-editor-block-list__layout")
	);
};

const masonrySelector = ".ud-card-grid.ud-card-grid--masonry";

const getNumber = (value, fallback = 0) => {
	const number = parseFloat(value);

	return Number.isFinite(number) ? number : fallback;
};

const getGridItems = (grid) => {
	return Array.from(grid.children).filter((item) => {
		return item.nodeType === 1;
	});
};

const layoutMasonryGrid = (grid) => {
	const isReady = grid.classList.contains("is-masonry-ready");

	const styles = window.getComputedStyle(grid);
	const items = getGridItems(grid);

	if (!items.length) {
		return;
	}

	const gridWidth = grid.clientWidth;
	const gap = getNumber(styles.gap || styles.columnGap, 30);
	const configuredItemWidth = getNumber(
		styles.getPropertyValue("--ud-card-grid-min-width"),
		360
	);

	const itemWidth = Math.min(configuredItemWidth, gridWidth);

	const columns = Math.max(
		1,
		Math.floor((gridWidth + gap) / (itemWidth + gap))
	);

	const totalWidth = columns * itemWidth + (columns - 1) * gap;
	const offsetX = Math.max(0, (gridWidth - totalWidth) / 2);
	const columnHeights = Array(columns).fill(0);

	grid.style.position = "relative";
	grid.style.display = "block";

	items.forEach((item) => {
		item.style.position = "absolute";
		item.style.width = `${itemWidth}px`;
		item.style.maxWidth = "none";
		item.style.margin = "0";
		item.style.boxSizing = "border-box";

		const shortestColumnIndex = columnHeights.indexOf(
			Math.min(...columnHeights)
		);

		const x = offsetX + shortestColumnIndex * (itemWidth + gap);
		const y = columnHeights[shortestColumnIndex];

		item.style.transform = `translate(${x}px, ${y}px)`;

		columnHeights[shortestColumnIndex] += item.offsetHeight + gap;
	});

	grid.style.height = `${Math.max(...columnHeights) - gap}px`;

	if (!isReady) {
		window.requestAnimationFrame(() => {
			grid.classList.add("is-masonry-ready");
		});
	}


};

const initMasonryGrid = (grid) => {
	const layout = () => {
		window.requestAnimationFrame(() => {
			layoutMasonryGrid(grid);
		});
	};

	layout();

	const resizeObserver = new ResizeObserver(layout);

	resizeObserver.observe(grid);

	getGridItems(grid).forEach((item) => {
		resizeObserver.observe(item);
	});

	grid.querySelectorAll("img").forEach((image) => {
		if (image.complete) {
			return;
		}

		image.addEventListener("load", layout, {
			once: true,
		});
	});

	const mutationObserver = new MutationObserver(layout);

	mutationObserver.observe(grid, {
		childList: true,
		subtree: true,
		characterData: true,
	});

	window.addEventListener("load", layout);
};

export const initMasonryGrids = () => {
	if (isBlockEditor()) {
		return;
	}

	document.querySelectorAll(masonrySelector).forEach((grid) => {
		if (grid.dataset.udMasonryInitialized === "true") {
			return;
		}

		grid.dataset.udMasonryInitialized = "true";
		initMasonryGrid(grid);
	});
};