import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: [
				'favicon.svg',
				'pwa-icon.svg',
				'screenshots/pet-journal-wide.svg',
				'screenshots/pet-journal-mobile.svg',
			],
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
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'any maskable',
					},
				],
				screenshots: [
					{
						src: '/screenshots/pet-journal-wide.svg',
						sizes: '1280x720',
						type: 'image/svg+xml',
						form_factor: 'wide',
					},
					{
						src: '/screenshots/pet-journal-mobile.svg',
						sizes: '390x844',
						type: 'image/svg+xml',
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
