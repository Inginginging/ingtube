const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //style-loader를 대신할 plugin. style-loader는 js폴더에 css를 주입하게 해줌. 우리가 원하는 것은 둘의 분리
const path = require('path')

module.exports = {
    entry: "./src/client/js/main.js", //변경하고자 하는 파일의 경로
    mode: "development", //개발중인 상태임.
    watch: true, //front내용을 계속해서 변경해도 assets를 재시작할 필요 없음.
    plugins: [new MiniCssExtractPlugin({filename:"css/styles.css"})],//css폴더를 따로 만들어서 css file 저장 가능하게 해줌.
    output:{                    //소스코드의 압축작업이 실행된 후 저장될 경로.
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'assets',), //__dirname은 intube의 절대경로를 나타냄.
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/, //모든 js파일들을
                use: {
                    loader: "babel-loader",  //babel-loader를 사용하여 세련되게 바꿀것이다.
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
            {
                test: /\.scss$/, //모든 scss 파일들
                use:[MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //가장 먼저 사용되는 loader를 가장 마지막에 배치. sass: scss->css / css: css를 해석 / style: html에 css입힘.
            }
        ],
    },
};