const webpack = require('webpack');
const path = require('path');

module.exports = {
    webpack: {
        plugins: {
            add: [
                new webpack.DefinePlugin({
                    process: {env: {}}
                })
            ]
        },
        alias: {
            Components: path.join(path.resolve(__dirname, 'src/components/')),
        },
    },
    babel: {
        presets: ['@babel/preset-react'],
        // plugins: [],
        loaderOptions: (babelLoaderOptions, { env, paths }) => {
            return babelLoaderOptions;
        },
    },
}