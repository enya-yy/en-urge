import path from 'node:path'
import fs from 'node:fs'
import { Preset, SourceCodeTransformer, defineConfig, presetUno } from 'unocss'
import { exists } from './scripts/utils'

export default defineConfig({
  presets: [
    presetUno({ preflight: false }),
    presetRemToRpx(),
    presetReplaceClassname(),
  ],
  transformers: [transformerReplaceClassname()],
  preflights: [],
  shortcuts: [
    {
      'border-t': 'border-0 border-t-1 border-solid border-gray-200',
    },
  ],
  blocklist: ['container'],
  safelist: 'm-auto invisible'.split(' '),
  content: {
    // Note: for `unocss` vscode plugin
    pipeline: {
      include: ['src/**/*.wxml'],
    },
  },
})

// https://unocss.dev/config/presets
const remRE = /(-?[\.\d]+)rem/g
function presetRemToRpx(): Preset {
  return {
    name: 'preset-rem-to-rpx',
    postprocess: util => {
      util.entries.forEach(i => {
        const value = i[1]
        if (value && typeof value === 'string' && remRE.test(value)) {
          i[1] = value.replace(remRE, (_, p1) => `${p1 * 32}rpx`)
        }
      })
    },
  }
}

const root = path.resolve(__dirname)
const srcDir = path.resolve(root, 'src')
const distDir = path.resolve(root, 'dist')
const rules = {
  '\\.': '_dot_',
  '\\/': '_slash_',
  '\\:': '_colon_',
  '\\%': '_percent_',
  '\\!': '_important_',
  '\\#': '_hash_',
  '\\(': '_left_parenthesis_',
  '\\)': '_right_parenthesis_',
  '\\[': '_left_bracket_',
  '\\]': '_right_bracket_',
  '\\$': '_dollar_',
  '\\,': '_comma_',
  '\\=': '_equal_',
}
const charRE = new RegExp(`[${Object.keys(rules).join('')}]`)
function presetReplaceClassname(): Preset {
  return {
    name: 'preset-replace-classname',
    postprocess: util => {
      if (!charRE.test(util.selector.slice(1))) return
      for (const [k, v] of Object.entries(rules)) {
        if (util.selector.includes(k, 1)) {
          util.selector = util.selector.replaceAll(k, v)
        }
      }
    },
  }
}

function transformerReplaceClassname(): SourceCodeTransformer {
  return {
    name: 'transformer-replace-classname',
    enforce: 'pre',
    idFilter(id) {
      return /\.wxml$/.test(id)
    },
    // Replace all classnames, from `whiteList
    async transform(s, id, { uno, tokens }) {
      let code = s.toString()
      const { matched } = await uno.generate(code)
      const replacements = Array.from(matched).filter(i => charRE.test(i))
      for (const replace of replacements) {
        let replaced = replace
        for (const [k, v] of Object.entries(rules)) {
          if (replaced.includes(k.slice(1))) {
            replaced = replaced.replaceAll(k.slice(1), v)
          }
        }
        tokens.add(replaced)
        uno.config.shortcuts.push([replaced, replace])
        code = code.replaceAll(replace, replaced)
      }

      const output = path.resolve(distDir, path.relative(srcDir, id))
      try {
        const dir = path.dirname(output)
        if (!(await exists(dir))) {
          await fs.promises.mkdir(dir, { recursive: true })
        }
        await fs.promises.writeFile(output, code)
      } catch {}
    },
  }
}
