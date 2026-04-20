import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: 'https://savaij.github.io',
  base: '/test-astro-site',
  integrations: [sitemap()],
});
