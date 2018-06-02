import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'

const year = new Date().getFullYear()

const banner = `/*!
 * Client Side Validations JS - v${pkg.version} (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) ${year} Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (http://opensource.org/licenses/mit-license.php)
 */
`

export default [
  {
    input: 'src/main.js',
    external: ['jquery'],
    output: [
      {
        file: pkg.browser,
        banner,
        format: 'umd',
        name: 'clientSideValidations',
        globals: {
          jquery: '$'
        }
      }
    ],
    plugins: [
      resolve(), // so Rollup can find `jquery`
      commonjs(), // so Rollup can convert `jquery` to an ES module
      babel({
        exclude: ['node_modules/**']
      }),
      copy({
        'dist/client-side-validations.js': 'vendor/assets/javascripts/rails.validations.js',
        verbose: true
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: 'src/main.js',
    external: ['jquery'],
    output: [
      { file: pkg.main, format: 'cjs', banner },
      { file: pkg.module, format: 'es', banner }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]
