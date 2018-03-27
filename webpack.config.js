var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	plugins: [
		new webpack.HotModuleReplacementPlugin() // Enable HMR
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		hot: true, // Tell the dev-server we're using HMR
		contentBase: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
    module: {
        rules: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015', 'react'],
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015'],
						}
					}
				]
			},
			{
	            test: /\.css$/,
				exclude: /node_modules/,
	            use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					'postcss-loader'
				],
	        },
			{ test: /\.(png|jpg)$/, exclude: /node_modules/, loader: 'url-loader', options: {
				limit: 2,
				name: '[path][name].[ext]',
			} }
		]
    },
};
