// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["radix-vue/nuxt"],
  css: ["~/assets/main.scss"],
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon", // Use 'image/png' for a PNG favicon
          href: "/favicon.ico", // Adjust this to '/favicon.png' if you are using a PNG
        },
      ],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ["swiper-container", "swiper-slide"].includes(tag),
    },
  },
  ssr: false,
});
