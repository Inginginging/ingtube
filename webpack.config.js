const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //style-loader를 대신할 plugin. style-loader는 js폴더에 css를 주입하게 해줌. 우리가 원하는 것은 둘의 분리
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    commentSection: BASE_JS + "commentSection.js",
    recorder: BASE_JS + "recorder.js",
  }, //변경하고자 하는 파일의 경로
  plugins: [
    new MiniCssExtractPlugin({ //css폴더를 따로 만들어서 css file 저장 가능하게 해줌.
      filename: "css/styles.css",
    }),
  ],
  output: {   //소스코드의 압축작업이 실행된 후 저장될 경로.
    filename: "js/[name].js", //entry에 있는 이름을 가져오는 변수 
    path: path.resolve(__dirname, "assets"), //__dirname은 intube의 절대경로를 나타냄.
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/, //모든 js파일들을
        use: {
          loader: "babel-loader", //babel-loader를 사용하여 세련되게 바꿀것이다.
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/, //모든 scss 파일들
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //가장 먼저 사용되는 loader를 가장 마지막에 배치. sass: scss->css / css: css를 해석 / style: html에 css입힘.
      },
    ],
  },
};