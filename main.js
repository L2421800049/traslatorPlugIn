const { log } = require("console");
const { BaiduTraslator } = require("./baiduTranslator");
const { Logger } = require("./extensions/loger");


function main() {
    const logger = new Logger().logger

    logger.info('start....')

    const bdt = new BaiduTraslator(logger)
    logger.info('成功创建百度翻译对象...')
    try{
        bdt.main("131")
    }catch (e){
        logger.error(e.stack)
    }
    logger.warn('end...bye bye!!!')
}

main()