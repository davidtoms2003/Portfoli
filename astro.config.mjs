// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Custom domain configuration
	site: 'https://portfoli.dtv.com/',
	base: '/',
	devToolbar: {
		enabled: false,
	},
});
