metting-room-booking-system/

├── apps/
│ ├── fronted-user/ # 当前的用户前端项目
│ └── fronted-admin/ # 后续的管理后台项目
├── packages/
│ ├── shared/ # 共享的工具和组件
│ │ ├── src/
│ │ │ ├── utils/ # 通用工具函数
│ │ │ ├── request/ # 请求相关
│ │ │ └── components/ # 共享组件
│ │ └── package.json
│ └── ui/ # UI 组件库（可选）
├── pnpm-workspace.yaml
└── package.json

# 其他

[万字长文手摸手带你从 0 到 1 搭建一个 monorepo 前端组件化项目](https://juejin.cn/post/7166625561769410591)

[Monorepo 多项目管理不再难！从零开始：pnpm workspace 手把手教你打造灵活、可扩展的开发环境](https://juejin.cn/post/7454035377106599963)

# shared 中的 eslint 配置

```js
关于上面的那个 eslint 的配置，我写成  eslint.config.js ,里面配置成这样 import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: ['../../.eslintrc.js'],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  }
)  为啥就不行了，和现在的有啥区别
```

这两种配置方式的主要区别在于：

1. 配置格式：

- `.eslintrc.json` 使用的是传统的 ESLint 配置格式（ESLint 7.x 及之前）
- `eslint.config.js` 使用的是新的扁平配置格式（ESLint 8.x 的新特性，称为 "Flat Config"）

2. 您当前的配置：

packages/shared/.eslintrc.json

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "../../.eslintrc.js"
  ],
  "plugins": ["react", "@typescript-eslint"],
  "parser": "@typescript-eslint/parser"
  // ... existing code ...
}
```

3. 新配置没有生效的可能原因：

- 需要确保 ESLint 版本 >= 8.21.0
- 需要在 `package.json` 中设置 `"type": "module"`
- 需要完整配置所有插件，因为扁平配置不会自动加载插件

建议的修改方案：

eslint.config.js

```javascript
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import react from 'eslint-plugin-react'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  { ignores: ['dist'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  }
)
```

如果不是特别需要使用新的扁平配置，建议暂时保持使用现有的 `.eslintrc.json` 配置方式，因为它更稳定且生态支持更好。
