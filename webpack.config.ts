import * as path from "path";
import { Configuration } from "webpack";
const widgetConfig: Configuration = {
  target: "node",
  entry: path.resolve(__dirname, "src", "marquee/widget.ts"),
  output: {
    path: path.resolve(__dirname, "out", "marquee"),
    filename: "widget.js",
    libraryTarget: 'commonjs2'
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: false,
                declarationMap: false,
                rootDir: __dirname,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};

export default widgetConfig;