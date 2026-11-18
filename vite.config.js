import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/Special-projek/" : "/",
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
})
