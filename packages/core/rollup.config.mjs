import fs from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dtsPlugin from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = createRequire(import.meta.url)('./package.json');

export default () => {
  clearDir('dist');

  const entrypoints = Object.values(packageJson.exports).filter(f => /^(\.\/)?src\//.test(f) && f.endsWith('.ts'));

  return [
    libBuildOptions({
      format: 'esm',
      extension: 'mjs',
      entrypoints,
      outDir: 'dist',
      sourcemap: false,
    }),
    libBuildOptions({
      format: 'cjs',
      extension: 'js',
      entrypoints,
      outDir: 'dist',
      sourcemap: false,
    }),
    declarationOptions({
      entrypoints,
      outDir: 'dist',
    }),
    browserBuildConfig({
      inputFile: './src/index.ts',
      outFile: packageJson.publishConfig.browser,
      name: 'BridgeCore',
      sourcemap: true,
    }),
  ];
};

function fileNames(extension = 'js') {
  return {
    entryFileNames: `[name].${extension}`,
    chunkFileNames: `_chunk/[name]-[hash:6].${extension}`,
  };
}

/**
 * @type {(options: {inputFile: string; outFile: string; name: string, sourcemap: boolean}) => import('rollup').RollupOptions}
 */
function browserBuildConfig({ inputFile, outFile, name, sourcemap }) {
  return {
    input: inputFile,
    plugins: [
      typescript({
        compilerOptions: {
          sourceMap: sourcemap,
          inlineSources: sourcemap || undefined,
          removeComments: true,
          declaration: false,
        },
      }),
    ],
    output: {
      plugins: [
        // Minify with terser, but with a configuration that optimizes for
        // readability in browser DevTools (after re-indenting by DevTools).
        terser({
          // Terser defaults to ES5 for syntax it adds or rewrites
          ecma: 2020,
          keep_fnames: true,
          compress: { sequences: false },
        }),
      ],
      format: 'iife',
      name,
      file: outFile,
      sourcemap,
      generatedCode: 'es2015',
    },
  };
}

/**
 * @type {(options: {
 *   entrypoints: string[];
 *   format: 'esm' | 'cjs';
 *   extension: 'js' | 'cjs' | 'mjs';
 *   outDir: string;
 *   sourcemap: boolean;
 * }) => import('rollup').RollupOptions}
 */
function libBuildOptions({ entrypoints, extension, format, outDir, sourcemap }) {
  const isESM = format === 'esm';
  return {
    input: mapInputs(entrypoints),
    plugins: [
      typescript({
        compilerOptions: {
          sourceMap: sourcemap,
          inlineSources: sourcemap || undefined,
          removeComments: !sourcemap,
          declaration: false,
        },
      }),
      alias({
        entries: [{ find: /^@\/(.+)/, replacement: join(__dirname, 'src/$1') }],
      }),
    ],
    output: {
      format,
      dir: outDir,
      ...fileNames(extension),
      // Using preserveModules disables bundling and the creation of chunks,
      // leading to a result that is a mirror of the input module graph.
      preserveModules: isESM,
      sourcemap,
      generatedCode: 'es2015',
      // Hoisting transitive imports adds bare imports in modules,
      // which can make imports by JS runtimes slightly faster,
      // but makes the generated code harder to follow.
      hoistTransitiveImports: false,
    },
  };
}

/**
 * @type {(options: {entrypoints: string[]; outDir: string}) => import('rollup').RollupOptions}
 */
function declarationOptions({ entrypoints, outDir }) {
  return {
    plugins: [
      alias({
        entries: [{ find: /^@\/(.+)/, replacement: join(__dirname, 'src/$1') }],
      }),
      dtsPlugin(),
    ],
    input: mapInputs(entrypoints),
    output: [
      {
        format: 'esm',
        dir: outDir,
        generatedCode: 'es2015',
        ...fileNames('d.mts'),
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      {
        format: 'cjs',
        dir: outDir,
        generatedCode: 'es2015',
        ...fileNames('d.ts'),
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
  };
}

function mapInputs(srcFiles) {
  return Object.fromEntries(
    srcFiles.map(file => [file.replace(/^(\.\/)?src\//, '').replace(/\.[cm]?(js|ts)$/, ''), join(__dirname, file)])
  );
}

function clearDir(dir) {
  const dirPath = join(__dirname, dir);
  if (dir && fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`cleared: ${dir}`);
  }
}
