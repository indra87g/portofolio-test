import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		{
			name: "vite-plugin-non-blocking-css",
			apply: "build", // Apply this plugin only during the build process
			enforce: "post", // Make sure it runs after CSS is generated
			transformIndexHtml(html) {
				const regex =
					/<link rel="stylesheet"(.*?)href="(.+?\.css)"(.*?)>/;
				const match = html.match(regex);

				if (match) {
					const cssUrl = match[2];
					const preloadLink = `
					<link rel="preload" crossorigin href="${cssUrl}" as="style">
					<link rel="stylesheet" crossorigin href="${cssUrl}">
					`;
					// Replace the original link tag with the new preload version
					return html.replace(match[0], preloadLink);
				}

				return html;
			},
		},
	],
	server: {
		allowedHosts: true,
	},
	build: {
		minify: "terser", // Use Terser for minification since give more smaller bundle
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Group all other node_modules into a general 'vendor' chunk
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
	},
});
