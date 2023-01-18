const { build } = require('esbuild')
const { resolve, relative } = require('path')
const args = require('minimist')(process.argv.slice(2));


const target = args._[0] || 'vue'
const format = args.f || 'global'
const inlineDeps = args.i || args.inline
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))
// resolve output
const outputFormat = format.startsWith('global')
    ? 'iife'
    : format === 'cjs'
        ? 'cjs'
        : 'esm'

const postfix = format.endsWith('-runtime')
    ? `runtime.${format.replace(/-runtime$/, '')}`
    : format
const outfile = resolve(
    __dirname,
    `../packages/${target}/dist/${target === 'vue-compat' ? `vue` : target
    }.${postfix}.js`
)
const relativeOutfile = relative(process.cwd(), outfile)

let external = []

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    external,
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
    plugins:
      format === 'cjs' || pkg.buildOptions?.enableNonBrowserBranches
        ? [nodePolyfills.default()]
        : undefined,
    define: {
      __COMMIT__: `"dev"`,
      __VERSION__: `"${pkg.version}"`,
      __DEV__: `true`,
      __TEST__: `false`,
      __BROWSER__: String(
        format !== 'cjs' && !pkg.buildOptions?.enableNonBrowserBranches
      ),
      __GLOBAL__: String(format === 'global'),
      __ESM_BUNDLER__: String(format.includes('esm-bundler')),
      __ESM_BROWSER__: String(format.includes('esm-browser')),
      __NODE_JS__: String(format === 'cjs'),
      __SSR__: String(format === 'cjs' || format.includes('esm-bundler')),
      __COMPAT__: String(target === 'vue-compat'),
      __FEATURE_SUSPENSE__: `true`,
      __FEATURE_OPTIONS_API__: `true`,
      __FEATURE_PROD_DEVTOOLS__: `false`
    },
    watch: {
      onRebuild(error) {
        if (!error) console.log(`rebuilt: ${relativeOutfile}`)
      }
    }
  }).then(() => {
    console.log(`watching: ${relativeOutfile}`)
  })