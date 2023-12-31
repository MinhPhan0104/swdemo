import path from "node:path";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { spawn } from 'child_process';

const outDir = 'public/build/';
const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: path.join(outDir, 'bundle.js'),
        format: 'iife',
        sourcemap: true,
        name: "app",
      },
    ],
    plugins: [
      svelte({
        preprocess: sveltePreprocess({
          postcss: true,
          sourceMap: !production,
        }),
        compilerOptions: {
          dev: !production,
        },
      }),
      css({ output: 'bundle.css' }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
        exportConditions: ['svelte'],
      }),
      commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
        rootDir: "./src",
      }),
      json(),
      !production && serve(),
      !production && livereload('public'),
      production && terser(),
    ],
    watch: {
      clearScreen: false
    }
  }
];
