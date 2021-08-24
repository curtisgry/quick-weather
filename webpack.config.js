const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
        entry: './src/index.js',
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'bundle.js',
                clean: true,
        },
        module: {
                rules: [
                        {
                                test: /\.css$/i,
                                use: ['style-loader', 'css-loader'],
                        },
                        {
                                test: /\.(png|jpe?g|gif)$/i,
                                use: [
                                        {
                                                loader: 'file-loader',
                                        },
                                ],
                        },
                ],
        },
        plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
