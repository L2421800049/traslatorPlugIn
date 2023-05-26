class MininUtil{
    constructor(){

    }
    isChinese(str) {
        const pattern = /[\u4e00-\u9fa5]/;
        return pattern.test(str);
    } 
}

module.exports = {
    MininUtil
}