import type { StorybookConfig } from '@storybook/nextjs-vite'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  async viteFinal(config) {
    const existingAlias = config.resolve?.alias ?? {}
    const alias =
      typeof existingAlias === 'object' && !Array.isArray(existingAlias)
        ? { ...existingAlias, '@': path.resolve(dirname, '..') }
        : { '@': path.resolve(dirname, '..') }
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias,
      },
    }
  },
}

export default config
