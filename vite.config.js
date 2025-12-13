import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
        navigateFallback: "/index.html",
      },
    }),
  ],
});
