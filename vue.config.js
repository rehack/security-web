const resolve = require('path').resolve

const port = process.env.port || process.env.npm_config_port || 9040

module.exports = {
    publicPath: '/',

    outputDir: "dist",
    assetsDir: "assets",
    filenameHashing: false,
    productionSourceMap: false,
    lintOnSave: false,
    runtimeCompiler: false,

    configureWebpack: (config) => {
        config.resolve = {
            extensions: ['.ts', '.json', '.vue', '.js', '.css'],
            alias: {
                '@': resolve(__dirname, './src'),
            }
        }
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'source-map'
        }
    },

    chainWebpack: (config) => {
        const svgRule = config.module.rule("svg")
        svgRule.uses.clear()
        svgRule
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options(
                {
                    symbolId: 'icon-[name]',
                    include: ['./src/icon']
                }
            )
    },

    css:{
        requireModuleExtension: true,
        extract: true,
        sourceMap: false,
        loaderOptions:{
            sass: {
                prependData: '@import "@/styles/main.scss";',
            },
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                }
            }
        }
    },

    // 它支持webPack-dev-server的所有选项

    devServer: {
        host: "localhost",
        port: port, // 端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        // 配置多个代理
        /*
        proxy: {
            "/": {
                target: process.env.VUE_APP_BASE_API,//目标主机
                ws: true,//代理的WebSockets
                changeOrigin: true,//需要虚拟主机站点,
            }
        }
        */
    },

}
