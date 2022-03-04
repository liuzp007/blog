const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const path = require("path");
const {
  override,
  addDecoratorsLegacy,
  adjustStyleLoaders,
  addWebpackAlias,
  fixBabelImports 
} = require("customize-cra");
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css",
  }),
  addDecoratorsLegacy(),
  addWebpackAlias({
    "@": path.resolve("src/"),
    "@store": path.resolve("src/store/"),
    "@router": path.resolve("src/router/"),
    "@page": path.resolve("src/page/"),
  }),
  adjustStyleLoaders((rule) => {
    if (rule.test.toString().includes("scss")) {
      rule.use.push({
        loader: require.resolve("sass-resources-loader"),
        options: {
          resources: ["./src/assets/scss/output.scss"],
        },
      });
    }
  }),
  (config) => {
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;
      // config.plugins.push(new BundleAnalyzerPlugin());
      config.externals = {
        React: "react",
        Swiper: "swiper",
        ReactDom: "react-dom",
        echarts: "echarts",
      };
      config.module.rules.push({
        test: /\.(jpg|png|gif|jpeg)$/i,
        loader: "image-webpack-loader",
      });
    }
    return config;
  }
);
