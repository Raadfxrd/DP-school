import { defineConfig, loadEnv, UserConfig } from "vite";
import { resolve } from "path";
import { globSync } from "glob";
import eslint from "vite-plugin-eslint";

export default defineConfig(({ mode }): UserConfig => {
    const env: Record<string, string> = loadEnv(mode, process.cwd(), "VITE");

    const viteConfiguration: Record<string, string> = Object.entries(env).reduce((prev, [key, val]) => {
        return {
            ...prev,
            [key.substring("VITE_".length)]: val,
        };
    }, {});

    let htmlFiles: string[];

    if (mode === "development") {
        htmlFiles = globSync("**/*.html", {
            cwd: resolve(__dirname, "./wwwroot"),
        });
    } else {
        htmlFiles = globSync("wwwroot/**/*.html", {
            cwd: resolve(__dirname, "./"),
        });
    }

    const input: Record<string, string> = {};
    htmlFiles.forEach((file: string, index: number) => {
        input[`app_${index}`] = resolve(file);
    });

    return {
        base: "./",
        root: "wwwroot",
        appType: "mpa",
        resolve: {
            alias: { "/src": resolve(__dirname, "./src") },
        },
        build: {
            sourcemap: true,
            rollupOptions: { input },
            outDir: resolve(__dirname, "../../dist/web"),
            emptyOutDir: true,
        },
        esbuild: { supported: { "top-level-await": true } },
        plugins: [eslint()],
        define: { viteConfiguration: JSON.stringify(viteConfiguration) }, // Correct stringification
        server: { strictPort: true, port: 3000 },
        preview: { strictPort: true, port: 3000 },
    };
});
