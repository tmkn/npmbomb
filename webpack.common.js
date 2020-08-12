const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/bootstrap.tsx'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'npmbomb',
            meta: {
                charset: { charset: 'utf-8' },
                viewport: 'width=device-width, initial-scale=1',
                description: 'Guess the number of dependencies for popular NPM packages',
                keywords: 'NPM,dependencies,number,guess',
                'twitter:card': 'summary_large_image',
                'twitter:site': '@tmkndev',
                'twitter:title': 'npmb💣mb',
                'twitter:description': 'Guess the number of dependencies for popular NPM packages'
            },
        }),
        new CopyPlugin({
            patterns: [
                { from: 'tools/npmdata/data', to: 'data' }
            ]
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        overlay: true,
        contentBase: path.join(__dirname),
        historyApiFallback: {
            disableDotRule: true
        }
    },
};