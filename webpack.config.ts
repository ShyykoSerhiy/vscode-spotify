import * as path from "path";
import { Configuration } from "webpack";
const exampleWidget: Configuration = {
  entry: path.resolve(__dirname, "src", "widget2.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "widget2.js",
  },
  devtool: "source-map",
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

export default exampleWidget;
