const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
	...defaultConfig,
	entry: {
		"galleryberg-pro": path.resolve(process.cwd(), "src", "index.js"),
		"galleryberg-pro-frontend": path.resolve(
			process.cwd(),
			"src",
			"frontend.js"
		),
		"galleryberg-pro-style": path.resolve(process.cwd(), "src", "style.scss"),
		"galleryberg-pro-editor": path.resolve(process.cwd(), "src", "editor.scss"),
	},
	optimization: {
		...defaultConfig.optimization,
	},
	plugins: [
		...defaultConfig.plugins.filter((p) => !(p instanceof CleanWebpackPlugin)),
	],
	output: {
		filename: (chunkData) => {
			switch (chunkData.chunk.name) {
				default:
					return "[name].js";
			}
		},
		path: path.resolve(process.cwd(), "build"),
	},
};
