const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const publicPath = "/op";
//发布默认采用nginx，详情nginx.conf
//路径配置
function createConfig(){
    process.env.PUBLIC_URL = publicPath;
    return {
        devtool: "cheap-eval-source-map",
        mode: "production",
        entry: {
            app: [
                path.resolve(__dirname, "src/index.js")
            ],
            vendor: [
                "react", "react-dom"
            ]
        },
        output: {
            path: path.join(__dirname, "dist"),
            publicPath: publicPath,
            filename: "static/js/bundle.[name].[hash].js"
        },
        resolve: {
            extensions: ['.wasm', '.mjs', '.js', '.json']
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    options: {
                        //stage-1 支持成员变量
                        presets: ['es2015', 'react', "stage-1"],
                        plugins: [
                            //装饰器支持
                            "transform-decorators-legacy",
                        ]
                    }
                },
                {
                    test: /\.(css|less)$/,
                    use: ["style-loader","css-loader","less-loader"]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    loader:"file-loader",
                    options:{
                       publicPath:publicPath,
                       name:"static/image/[hash].[ext]"
                    },
                }
            ]
        },
        optimization: {
            namedModules: true,
            minimize: true,
            mergeDuplicateChunks: true
        },
        plugins: [
            new CleanWebpackPlugin(["dist"]),
            new CopyWebpackPlugin([{ from: 'public', to: "",ignore:"*.html" }]),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                PUBLIC_PATH:publicPath,
                filename:"index.html",
                template: path.resolve(__dirname, "public/index.html")
            }),
        ]
    }
}
module.exports = createConfig();