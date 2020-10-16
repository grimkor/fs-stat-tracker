const path = require("path");

const rootPath = path.resolve(__dirname, "..");

module.exports = {
  externals: { sqlite3: "commonjs sqlite3" },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "source-map",
  entry: {
    main: path.resolve(rootPath, "electron", "main.ts"),
    logParser: path.resolve(rootPath, "electron", "log_parser", "index.ts"),
  },
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(rootPath, "dist", "electron"),
    filename: "[name].js",
  },
};
