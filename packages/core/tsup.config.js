// @ts-check

import { defineConfig } from 'tsup';
import { config } from '../../scripts/getTsupConfig.js';

export default defineConfig({
  ...config({
    entry: ['src/index.ts'],
  }),
  format: ['cjs', 'esm', 'iife'],
  globalName: 'WebUnityBridge',
  minify: true,
});
