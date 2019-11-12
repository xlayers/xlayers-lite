import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'xlayers-lite',
  testing:{
    moduleFileExtensions: ['json', 'ts', 'tsx', 'js', 'css'],
    moduleNameMapper: {
      '@xlayers/css-blocgen': '<rootDir>/src/@xlayers/css-blocgen/',
      '@xlayers/sketch-lib' : '<rootDir>/src/@xlayers/sketch-lib/',
      '@xlayers/svg-blocgen' : '<rootDir>/src/@xlayers/svg-blocgen/',
    }
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  plugins: [nodePolyfills()]
};
