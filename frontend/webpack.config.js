const path = require('path');

module.exports = {
  mode: 'development', // or 'production' for minified output
  entry: path.resolve(__dirname, './src/index.tsx'), // Corrected path
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    clean: true, // Clean the output directory before emit
  },
  resolve: {
    extensions: ['.js', '.jsx', '*'],
    fallback: {
      path: false,
      fs: false,
      os: false,
    },
  },
  devtool: 'source-map', // More performant for production
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            // Changed 'query' to 'options' as per webpack 5 standards
            presets: ['@babel/env', '@babel/react'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  // Added webpack 5 specific optimizations
  optimization: {
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // Better performance settings
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
};
