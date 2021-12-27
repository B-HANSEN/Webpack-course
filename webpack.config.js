var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var extractPlugin = new ExtractTextPlugin({
   filename: 'main.css'
});

module.exports = {
    mode: 'development', // enable webpack's built-in optimizations that correspond to each environment. The default value is production
    devtools: 'eval.source.map', // use source maps for easier debugging; set "sourceMap": true in tsconfig.json 
    entry: './src/js/app.js', // source file
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js', // js bundle
        // publicPath: '/dist'  // when the index.html is in the dist folder, comment this out
        clean: true, //  good practice to clean the /dist folder before each build
    },
    module: {
        rules: [ //  loaders used to transform certain types of modules
            {
                test: /\.js$/,  // \. Regex escape to not use all characters but specifically the '.'-character
                use: [
                    {
                        loader: 'babel-loader', // transpiles JS files using Babel and webpack
                        options: { // code which isn't supported yet in browsers, will get transpiled back to vanilla JavaScript
                            presets: ['es2015'] // enables transformation of ES6 module syntax to another module type
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: extractPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(jpg|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]', // default is using a hash, here keep file name
                            outputPath: 'img/',  // default, will be put into dist folder
                            publicPath: 'img/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [  // plugins can be leveraged to perform a wider range of tasks like bundle optimization
        extractPlugin,  // moves all the required *.css modules in entry chunks into a separate CSS file
        new HtmlWebpackPlugin({  // instantiate this plugin, by default generates its own index.html file
            template: 'src/index.html' // will replace our index.html and adds all bundles automatically
        })
    ]
}; 

// use webpack dev server: preview code as it is written