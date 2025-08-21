// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');


const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = 'style-loader';

const config = {
    entry: "./src/main.tsx",
    output: {
        filename: 'main.js', // nome do arquivo de saida
        path: path.resolve(__dirname, 'dist'), // entra na pasta dist e executa
    },
    devServer: {
        host: 'localhost',
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true, // Redireciona todas as solicitações para o index.html
        compress: true,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html", // nome do arquivo de saida
            inject: 'body', // Garante que o script será injetado no final do body
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: { loader: "html-loader" }
            },
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
        fallback: { "http": false, "browser": false, "https": false, "zlib": false, "stream": false, "url": false, "buffer": false, "timers": false, "assert": false, "axios": false }
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = 'development';
    }
    return config;
};
