const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const rootPath = path.resolve(__dirname, "..");

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    mainFields: ["main", "module", "browser"],
  },
  entry: path.resolve(rootPath, "src", "index.tsx"),
  target: "electron-renderer",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|jpg|gif$/,
        use: ["file-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: "url-loader?name=[name].[ext]",
      },
    ],
  },
  devServer: {
    contentBase: path.join(rootPath, "dist/renderer"),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 3000,
    publicPath: "/",
  },
  output: {
    path: path.resolve(rootPath, "dist/renderer"),
    filename: "js/[name].js",
    publicPath: "./",
  },
  plugins: [new HtmlWebpackPlugin({ template: "public/index.html" })],
};
