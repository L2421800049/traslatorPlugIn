var log4js = require("log4js");
const SysUtil = require('../utils/_sys').SysUtil

class Logger{
    constructor(){
        this.logger = log4js.getLogger()
        this.logger.level = "debug";
    }
}

module.exports = {
    Logger
}
