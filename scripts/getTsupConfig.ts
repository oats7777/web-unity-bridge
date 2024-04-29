// @ts-check
/**
 * @param {Object} opts - Options for building configurations.
 * @param {string[]} opts.entry - The entry array.
 * @returns {import('tsup').Options}
 */

export function config(opts: { entry: string[] }): import('tsup').Options {
  return {
    entry: opts.entry,
    format: ['cjs', 'esm'],
    target: ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77'],
    outDir: 'build',
    dts: true,
    sourcemap: true,
    clean: true,
  };
}
