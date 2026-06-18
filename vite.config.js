import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/// <reference types="vitest" />
export default defineConfig(({ mode: _mode }) => {
  return {
    plugins: [
      react(),
      // Image optimization: compresses PNG/JPEG/WebP assets during build
      // Reduces logo.png from ~225KB → ~40-60KB without visible quality loss
      ViteImageOptimizer({
        test: /\.(png|jpe?g|gif|webp|avif|svg)$/i,
        includePublic: true, // Also optimise files in the /public directory
        logStats: true,      // Print compression stats in build output
        png: {
          // sharp PNG options
          quality: 80,
          compressionLevel: 9,
        },
        jpeg: {
          quality: 82,
        },
        jpg: {
          quality: 82,
        },
        webp: {
          lossless: false,
          quality: 80,
        },
      }),
      tailwindcss({
        config: {
          content: ["./src/**/*.{js,jsx,ts,tsx}"],
          theme: {
            extend: {
              fontFamily: {
                // Tinos serif font for headings and expressive typography
                tinos: ["'Tinos'", "Georgia", "serif"],
                // Keep default sans-serif for body text
                sans: ["system-ui", "sans-serif"],
                // Serif fallback option
                serif: ["'Tinos'", "Georgia", "serif"],
              },
              typography: {
                DEFAULT: {
                  css: {
                    // Apply Tinos to all heading elements
                    "h1, h2, h3, h4, h5, h6": {
                      fontFamily: "'Tinos', Georgia, serif",
                      fontWeight: "700",
                    },
                    h1: {
                      fontSize: "2.25rem",
                      fontWeight: "900",
                    },
                    h2: {
                      fontSize: "1.875rem",
                      fontWeight: "700",
                    },
                    h3: {
                      fontSize: "1.5rem",
                      fontWeight: "700",
                    },
                    h4: {
                      fontSize: "1.125rem",
                      fontWeight: "700",
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ],
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@data": path.resolve(__dirname, "./src/data"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@test": path.resolve(__dirname, "./src/test"),
      },
    },
    build: {
      // Inline small assets (<4KB) directly to reduce HTTP requests
      assetsInlineLimit: 4096,
      // Use terser for aggressive dead code elimination in production
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,      // Remove console.log/warn in production
          drop_debugger: true,     // Remove debugger statements
          pure_funcs: ["console.warn", "console.log", "console.error"],
          passes: 2,               // Multiple compression passes
        },
        mangle: {
          safari10: true,          // Safari 10 compatibility
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React vendor
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            // UI component libraries
            "ui-vendor": ["@heroicons/react", "@headlessui/react"],
            // File upload
            "form-vendor": ["react-dropzone"],
            // HTTP client
            "http-vendor": ["axios"],
          },
        },
      },
      // Performance budgets
      chunkSizeWarningLimit: 1000, // Warn if chunks exceed 1000kb
      reportCompressedSize: true,
    },
    test: {
      globals: true,
      environment: "happy-dom",
      globalSetup: ["./src/test/globalSetup.js"],
      setupFiles: ["./src/test/setup.js"],
      css: true,
      exclude: ["**/e2e/**", "**/node_modules/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "src/test/",
          "**/*.d.ts",
          "**/*.config.js",
          "dist/",
          "e2e/",
        ],
        thresholds: {
          global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
          },
        },
      },
    },
  };
});
