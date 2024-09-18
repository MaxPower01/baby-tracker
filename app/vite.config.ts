import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV === "development"
      ? undefined
      : VitePWA({
          registerType: "autoUpdate",
          manifest: {
            name: "Journal de bébé",
            short_name: "Journal bébé",
            start_url: "/",
            display: "standalone",
            background_color: "#1E212A",
            theme_color: "#222530",
            description: "Suivez l'évolution de votre bébé au jour le jour",
            icons: [
              {
                src: "icons/icon-72x72.png",
                sizes: "72x72",
                type: "image/png",
              },
              {
                src: "icons/icon-96x96.png",
                sizes: "96x96",
                type: "image/png",
              },
              {
                src: "icons/icon-128x128.png",
                sizes: "128x128",
                type: "image/png",
              },
              {
                src: "icons/icon-144x144.png",
                sizes: "144x144",
                type: "image/png",
              },
              {
                src: "icons/icon-152x152.png",
                sizes: "152x152",
                type: "image/png",
              },
              {
                src: "icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
              },
              {
                src: "icons/icon-384x384.png",
                sizes: "384x384",
                type: "image/png",
              },
              {
                src: "icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
              },
            ],
            lang: "fr",
            categories: [
              "education",
              "medical",
              "family",
              "lifestyle",
              "productivity",
            ],
          },
          devOptions: {
            enabled: true,
          },
        }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
