// craco.config.js 文件

const path = require('path');

module.exports = {
    reactScriptsVersion: "react-scripts" /* (default value) */,
    // // 更改 babel 配置
    // babel: {
    //     presets: [],
    //     plugins: [
    //     ]
    // },
    webpack: {
        // 添加 webpack -> alias
        alias: {},
        // 添加 webpack -> plugins
        plugins: {
            add: [], /* An array of plugins */
            remove: [],  /* An array of plugin constructor's names (i.e. "StyleLintPlugin", "ESLintWebpackPlugin" ) */
        },
        // 添加 webpack -> configure
        configure: {
            /* Any webpack configuration options: https://webpack.js.org/configuration */
        },
        // 动态更改 webpack 配置
        configure: (webpackConfig, { env, paths }) => {
            return webpackConfig;
        }
    },
    devServer: { /* Any devServer configuration options: https://webpack.js.org/configuration/dev-server/#devserver. */ },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => { return devServerConfig; }
};