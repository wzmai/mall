const pxtorem = require("postcss-pxtorem");

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

// 定义压缩文件类型
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const path = require("path");

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  // 输出文件目录
  outputDir: "dist",
  publicPath: "./", // 默认'/'，部署应用包时的基本URL

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: "static",
  indexPath: "index.html",

  // 默认在生成的静态资源文件名中包含hash以控制缓存
  filenameHashing: true,

  // 代码保存时进行eslint检测
  lintOnSave: true,

  // 是否使用带有浏览器内编译器的完整构建版本
  runtimeCompiler: true,

  // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  productionSourceMap: false,

  // 如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性
  integrity: false,

  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 是否自动打开浏览器
    host: "192.168.254.124",
    port: 8098, // 端口
    https: false, // https
    hotOnly: true, // 热更新

    proxy: {
      "/api": {
        target: "https://usermallapi.weekfuns.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "api"
        }
      }
    }
  },

  // configureWebpack 打包设置 开启 gzip 压缩
  configureWebpack: config => {
    const plugins = [];
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );

      // 单独打包第三方
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            common: {
              name: "chunk-common",
              chunks: "initial",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },

            node_vendors: {
              name: "chunk-libs",
              chunks: "initial", // 只打包初始时依赖的第三方
              test: /[\\/]node_modules[\\/]/,
              priority: 10
            }
          }
        }
      };
    }

    config.plugins = [...config.plugins, ...plugins];
  },

  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);

    if (IS_PROD) {
      // 压缩图片
      config.plugin("html").tap(args => {
        args[0].minify = false;
        return args;
      });

      // 打包分析
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static"
        }
      ]);

      // 第三方打包
      config.optimization.delete("splitChunks");
    }

    return config;
  },

  css: {
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 37.5,
            propList: ["*"]
          })
        ]
      }
    }
  }
};
