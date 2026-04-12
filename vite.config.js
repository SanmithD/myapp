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
      ],

      manifest: {
        name: "My App",
        short_name: "MyApp",
        start_url: "./",
        scope: "./",
        display: "standalone",
        description: "Offline React App",
        theme_color: "#000000",

        icons: [
          {
            src: "main-logo.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "main-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "log.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "voice-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "draw-logo.jpg",
            sizes: "192x192",
            type: "image/jpg",
          },
          {
            src: "password-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "trade.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "time.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
        navigateFallback: "/index.html",
      },

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
    }),
  ],
});
