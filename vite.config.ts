import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        watch: {
            usePolling: true
        }
    },
    plugins: [react(), nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        exclude: [
            "fs", // Excludes the polyfill for `fs` and `node:fs`.
        ],
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
    }),],
})
