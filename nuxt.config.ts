export default defineNuxtConfig({
  ssr: false,
  srcDir: "src/",
  modules: ["@pinia/nuxt", "@element-plus/nuxt"],
  css: [
    "~/app/styles/main.scss",
    "~/app/styles/element-overrides.scss"
  ],
  elementPlus: {
    importStyle: "scss"
  },
  app: {
    head: {
      title: "Luna test "
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  devtools: { enabled: false }
})
