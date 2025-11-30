import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

const wp = ["blocks", "editor", "block-editor", "data", "i18n", "element"];

const external = {
	jquery: "jQuery",
	"lodash-es": "lodash",
	lodash: "lodash",
	moment: "moment",
	"react-dom": "ReactDOM",
	"react-dom/client": "ReactDOM",
	react: "React",
};

wp.forEach((wpEntry) => {
	external[`@wordpress/${wpEntry}`] =
		"wp." + wpEntry.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
});

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	esbuild: {
		loader: "jsx",
		include: /src\/.*\.js$/,
		exclude: [],
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".js": "jsx",
			},
		},
	},
	build: {
		minify: "esbuild",
		outDir: "../galleryberg-gallery-block/includes/Admin/assets",
		emptyOutDir: true,
		lib: {
			entry: path.resolve(__dirname, "src/index.js"),
			name: "galleryberg-admin-app",
			fileName: () => "galleryberg-admin.build.js",
			formats: ["umd"],
		},
		rollupOptions: {
			external: Object.keys(external),
			output: {
				globals: external,
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === "style.css") {
						return "galleryberg-admin-style.css";
					}
					return assetInfo.name;
				},
			},
		},
		cssCodeSplit: false,
	},
	define: {
		"process.env.NODE_ENV": '"production"',
	},
});
