import { initMasonryGrids } from "../../utils/masonry";

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initMasonryGrids);
} else {
	initMasonryGrids();
}