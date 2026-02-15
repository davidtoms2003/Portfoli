// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages project configuration
	// Updated to match the current repository owner/name deployed to Pages
	site: 'https://davidtoms2003.github.io/Portfoli/',
	base: '/Portfoli/',
	devToolbar: {
		enabled: false,
	},
});
