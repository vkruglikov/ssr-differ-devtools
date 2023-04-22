import webpack from "webpack";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

const config: webpack.Configuration = {
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  devtool: "inline-source-map",
  entry: {
    content: path.resolve("/src/content.ts"),
    background: path.resolve("/src/background.ts"),
    devtools: path.resolve("/src/devtools.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};

export default config;
