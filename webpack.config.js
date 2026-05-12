const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DependencyExtractionWebpackPlugin = require("@wordpress/dependency-extraction-webpack-plugin");

module.exports = {
	mode: "production",

	entry: {
		editor: "./src/editor.scss",
		global: "./src/global.scss",

		"block-styles/image-scroll-reveal/editor-script":
			"./src/block-styles/image-scroll-reveal/editor.js",
		"block-styles/image-scroll-reveal/frontend-script":
			"./src/block-styles/image-scroll-reveal/frontend.js",

		"block-styles/paragraph-lead/editor-script":
			"./src/block-styles/paragraph-lead/editor.js",
		"block-styles/paragraph-lead/frontend-script":
			"./src/block-styles/paragraph-lead/frontend.js",

		"blocks/card-buttons/editor-script":
			"./src/blocks/card-buttons/edit.js",

		"blocks/card-button/editor-script": "./src/blocks/card-button/edit.js",

		"blocks/card-chips/editor-script": "./src/blocks/card-chips/edit.js",

		"blocks/card-chip/editor-script": "./src/blocks/card-chip/edit.js",

		"blocks/info-list/editor-script": "./src/blocks/info-list/edit.js",

		"blocks/card-grid/frontend-script":
			"./src/blocks/card-grid/frontend.js",

		"blocks/card-grid/editor-script": "./src/blocks/card-grid/edit.js",

		"blocks/content-card/editor-script":
			"./src/blocks/content-card/edit.js",

		"blocks/image-slider/editor-script":
			"./src/blocks/image-slider/edit.js",

		"blocks/image-slider/frontend-script":
			"./src/blocks/image-slider/frontend.js",

		"blocks/image-slide/editor-script": "./src/blocks/image-slide/edit.js",

		"blocks/team-hero/editor-script": "./src/blocks/team-hero/edit.js",

		"blocks/team/editor": "./src/blocks/team/editor.js",
		"blocks/team-loop/editor-script": "./src/blocks/team-loop/edit.js",

		"blocks/offene-stelle/editor-script":
			"./src/blocks/offene-stelle/edit.js",

		"blocks/offene-stelle-button/editor-script":
			"./src/blocks/offene-stelle-button/edit.js",
	},

	output: {
		path: path.resolve(__dirname, "build"),
		filename: "[name].js", // wird nicht wirklich genutzt, aber nötig
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@wordpress/babel-preset-default"],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new DependencyExtractionWebpackPlugin({
			outputFormat: "php",
			outputFilename: "[name].asset.php",
		}),
		new CopyPlugin({
			patterns: [
				{
					from: "src/blocks",
					to: "blocks",
					globOptions: {
						ignore: ["**/*.js", "**/*.scss"],
					},
				},
				{
					from: "src/utils/fonts",
					to: "fonts",
				},
			],
		}),
	],

	externals: {
		"@wordpress/block-editor": "wp.blockEditor",
		"@wordpress/blocks": "wp.blocks",
		"@wordpress/element": "wp.element",
	},

	stats: "minimal",
};
