import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: {
        global: true,
        process: true,
        Buffer: true,
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      // Ensures the service worker takes control immediately on install/update,
      // instead of waiting for a page reload — helps first-load offline reliability.
      injectRegister: "auto",

      // Everything the app needs cached for offline use, INCLUDING all feature icons.
      // This is separate from manifest.icons below — this just controls precaching.
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "log.png",
        "logo.png",
        "main-logo.png",
        "voice-logo.png",
        "draw-logo.jpg",
        "password-logo.png",
        "trade.png",
        "time.png",
        "book.png",
        "book_reader.png",
      ],

      manifest: {
        name: "My App",
        short_name: "MyApp",
        start_url: "./",
        scope: "./",
        display: "standalone",
        description: "Offline React App",
        theme_color: "#000000",
        background_color: "#000000",

        // ONLY the app logo goes here — this is what shows as the installed
        // app icon on home screens / app drawers / taskbars.
        // Feature-specific icons (trade, time, book, voice, draw, password, etc.)
        // must NOT be listed here or the OS may pick one of them instead.
        icons: [
          {
            src: "main-logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "main-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "main-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        // Explicitly include all image extensions used by your feature icons
        // (jpg was missing before, which would've silently excluded draw-logo.jpg)
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,woff,woff2}"],
        navigateFallback: "/index.html",
        // Don't let the SPA fallback swallow requests for the icon files themselves
        navigateFallbackDenylist: [/^\/(main-logo|logo|log|voice-logo|draw-logo|password-logo|trade|time|book|book_reader)\.(png|jpg)$/],
        runtimeCaching: [
          {
            // Cache-first for images so they load instantly offline after first visit
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],

  // Correct placement: build config is a top-level key, not inside VitePWA.
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          webrtc: ["simple-peer"],
        },
      },
    },
  },
});