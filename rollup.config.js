import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import image from "@rollup/plugin-image";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "./src/marquee/widget/index.ts",
  output: {
    format: "iife",
    sourcemap: true,
    name: "app",
    file: "dist/marquee/widget.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      customElement: true,
      tag: null,
      css: (css) => {
        css.write("widget.css");
      },
    }),

    resolve({ browser: true, dedupe: ["svelte"] }),
    commonjs(),
    typescript({
      tsconfig: "src/marquee/tsconfig.json",
      sourceMap: !production,
      inlineSources: !production,
    }),
    image(),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
