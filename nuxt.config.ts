// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/main.scss"],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ["swiper-container", "swiper-slide"].includes(tag),
    },
  },
  ssr: false,
});
