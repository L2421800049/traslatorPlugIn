const { default: axios } = require("axios");
const { MininUtil } = require("./utils/mixin");
const logger = require('./extensions/loger').Logger

class BaiduTraslator{
    constructor(logger){
        this.token = null
        this.i = null
        this.mininUtil = new MininUtil()
        this.ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        this.logger = logger
    }
    
    a(r) {
        if (Array.isArray(r)) {
            for (var o = 0, t = Array(r.length); o < r.length; o++)
                t[o] = r[o];
            return t
        }
        return Array.from(r)
    }
    
    n(r, o) {
        for (var t = 0; t < o.length - 2; t += 3) {
            var a = o.charAt(t + 2);
            a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a),
            a = "+" === o.charAt(t + 1) ? r >>> a : r << a,
            r = "+" === o.charAt(t) ? r + a & 4294967295 : r ^ a
        }
        return r
    }
    
    e(r,i) {
        // var i = "320305.131321201"
        var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
        if (null === o) {
            var t = r.length;
            t > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10))
        } else {
            for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++)
                "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
                C !== h - 1 && f.push(o[C]);
            var g = f.length;
            g > 30 && (r = f.slice(0, 10).join("") + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") + f.slice(-10).join(""))
        }
        var u = void 0
          , l = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
          u = null !== i ? i : (i = window[l] || "") || "";
        for (var d = u.split("."), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) {
            var A = r.charCodeAt(v);
            128 > A ? S[c++] = A : (2048 > A ? S[c++] = A >> 6 | 192 : (55296 === (64512 & A) && v + 1 < r.length && 56320 === (64512 & r.charCodeAt(v + 1)) ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)),
            S[c++] = A >> 18 | 240,
            S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224,
            S[c++] = A >> 6 & 63 | 128),
            S[c++] = 63 & A | 128)
        }
        for (var p = m, F = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++)
            p += S[b],
            p = this.n(p, F);
        return p = this.n(p, D),
        p ^= s,
        0 > p && (p = (2147483647 & p) + 2147483648),
        p %= 1e6,
        p.toString() + "." + (p ^ m)
    }
    
    async getWordTraslator(word) {
        const sign = this.e(word, this.i)
        const data = {
            "query": word,
            "transtype": "realtime",
            "simple_means_flag": 3,
            "sign": sign,
            "token": this.token,
            "domain": "common",
            "ts": Date.now()
        }
        let from = 'en'
        let to = 'zh'
        if (this.mininUtil.isChinese(word)) {
            from = 'zh'
            const to = 'en'
        }
        data.from = from
        data.to = to

        const url = "https://fanyi.baidu.com/v2transapi?" + 'from=' + from + '&to=' + to
        const headers = {
            "User-Agent": this.ua,
        }
        headers.Cookie = this.cookies
        const resp =  await axios.post(url, data, { headers }).then(
            (response) => {
                return response.data
            }
        ).catch(
            (e) => {
                console.log(e)
            }
        )
        return resp.trans_result.data[0].dst
    }

    async getToken() {
    
        const url = 'https://fanyi.baidu.com/#en/zh/a'
        const headers = {
            'User-Agent': this.ua,
        }
        let cookies = []
        await axios.get(url, { headers }).then(
            (response) => {
                const setCookieHeader = response.headers['set-cookie'];
                // 将 Set-Cookie 值添加到 CookieJar 中
                setCookieHeader.forEach(cookieStr => {
                    cookies.push(cookieStr.split(';')[0])
                });
            }
        ).catch(
            (e) => {
                console.log(e)
            }
        )
        this.cookies = cookies.join(';')    
        headers.Cookie = this.cookies
        await axios.get(url, { headers }).then(
            (response) => {
                this.token = response.data.match(/token: '.*?'/)[0].split(' ')[1].slice(1, -1)
                this.i = response.data.match(/gtk = ".*"/)[0].split('= "')[1].slice(0, -1)
            }
        ).catch(
            (e) => {
                console.log(e)
            }
        )
    }
    
    async main(word) {
        this.logger.info('Baidu Translate word:\t' + word)
        await this.getToken()
        const resp = await this.getWordTraslator(word)
        console.log(resp)
        this.logger.info('Baidu Translate word:\t' + word + '\n结果是:\t' + resp)

    }
}


module.exports = {
    BaiduTraslator
}

