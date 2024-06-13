# WeChat MiniProgram Starter

> This is a template for [WeChat MiniProgram](https://developers.weixin.qq.com/miniprogram/dev/framework/).

## Features

- 🚀 Enable `style: v2` & `weui: true` ([useExtendedLib](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#useExtendedLib)) in `app.json`
- 💪 Integration TypeScript
- 🎨 Integration UnoCSS
- 🛠️ Build System with [scripts](./scripts/)
- 📣 Wrap a event emitter power by [mitt](https://github.com/developit/mitt)
- 📦 Provide a [`enhancePage`](./src/enhance-page.ts) function to wrap the original [`Page`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)

## Usage

```bash
gh repo create <your_app_name> --template yuler/mini-starter
cp .env.example .env
```

- Change the `appid` in [project.config.json](./project.config.json)
- Download `private.${appid}.key` file from [Weixin Official Accounts Platform](https://mp.weixin.qq.com/wxamp/devprofile/get_profile)

## Scripts

- `ide:*` forward to [WeChat Devtools CLI](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)
- `build` compile the source code to the `dist` directory
- `dev` run with watch mode for development
- `upload` upload the code via [miniprogram-ci](https://www.npmjs.com/package/miniprogram-ci)

## Related

- [微信小程序框架](https://developers.weixin.qq.com/miniprogram/dev/framework)
