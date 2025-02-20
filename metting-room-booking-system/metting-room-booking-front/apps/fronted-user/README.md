# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```


# 初始化工作


## .vscode

为了确保团队所有成员都使用相同的 VS Code 设置，我们可以在项目根目录创建 .vscode 文件夹，并添加工作区设置。这些设置会随项目一起提交到代码仓库，所有克隆项目的团队成员都会自动应用这些设置。

让我们创建工作区设置：

settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single",
  "prettier.singleQuote": true,
  "prettier.semi": false
}
```
2. 创建推荐扩展配置文件，提示团队成员安装必要的扩展：

extensions.json

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "editorconfig.editorconfig"
  ]
}
```

这样设置后：

1. 当团队成员首次打开项目时，VS Code 会提示安装推荐的扩展
2. 工作区设置会自动生效，覆盖个人的 VS Code 设置
3. 所有团队成员都会使用相同的格式化规则
记得将 .vscode 文件夹提交到版本控制系统中，这样其他团队成员克隆项目后就能自动获得这些设置。


## .editorconfig

使用 .editorconfig 是一个很好的做法，可以帮助团队统一代码风格.

```json
# EditorConfig is awesome: https://EditorConfig.org

# 表示是最顶层的配置文件
root = true

# 匹配所有文件
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

# 匹配前端相关文件
[*.{js,jsx,ts,tsx,css,less,scss,vue,json,html}]
indent_style = space
indent_size = 2
quote_type = single
semi = false
```