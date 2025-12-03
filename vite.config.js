import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  base: "/impostor-city/",
  build: {
    target: "esnext"
  },
  server: { port: 3000 }
});
