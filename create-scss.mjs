import fs from "fs";
import path from "path";

const baseDir = path.resolve("src/blocks");

// alle Ordner in src/blocks holen
const blockDirs = fs
	.readdirSync(baseDir, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name);

blockDirs.forEach((block) => {
	const blockPath = path.join(baseDir, block);

	const files = ["editor.scss", "frontend.scss"];

	files.forEach((file) => {
		const filePath = path.join(blockPath, file);

		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, "", "utf8");
			console.log(`✔ erstellt: ${filePath}`);
		} else {
			console.log(`– existiert: ${filePath}`);
		}
	});
});

console.log("\nFertig.");