const { log } = require("console");
const { BaiduTraslator } = require("./baiduTranslator");
const { Logger } = require("./extensions/loger");
const express = require('express');

function main() {
    const logger = new Logger().logger

    logger.info('start....')

    const bdt = new BaiduTraslator(logger)
    logger.info('成功创建百度翻译对象...')
    

    const app = express()
    const port = 8096
    app.use(express.urlencoded({ extended: true })); // 允许解析 URL 编码的请求体
    app.use(express.json()); // 允许解析 JSON 请求体

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*'); // 允许来自任何来源的跨域请求
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // 允许特定的请求头
        next();
      });
      

    app.post('/v1/translator', async(req, res) => {
        var { word, token } = req.body; // 从请求体中获取 word 和 token 参数
        word = decodeURIComponent(word)
        res.header('Access-Control-Allow-Origin', '*'); // 允许跨域访问
      
        if (token === 'lkymnCgQjaJnCyjh') {
          const result = await bdt.main(word);
          const data = {
            word: word,
            result: result
          };
          res.json(data);
        } else {
          const error = {
            message: 'Authorization Error'
          };
          res.status(401).json(error);
        }
      });
    app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    });    
}

main()