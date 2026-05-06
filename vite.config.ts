import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'pwa-icon.svg'],
			manifest: {
				name: 'Pet Journal',
				short_name: 'Pet Journal',
				description:
					'Store dog and cat profiles, health notes, heat periods, and pictures locally.',
				theme_color: '#2f6f73',
				background_color: '#f8f5ef',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				icons: [
					{
						src: '/pwa-icon.svg',
						sizes: 'any',
						type: 'image/svg+xml',
						purpose: 'any maskable',
					},
				],
			},
			workbox: {
				cleanupOutdatedCaches: true,
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
			},
		}),
	],
});
