import axios from 'axios';
import message from 'antd/es/message';
import 'antd/es/message/style';
import uuidv1 from 'uuid/v1';
import {
    logout
} from '../login/authorize';

import CryptoJS from 'crypto-js/crypto-js';

const API_HOST = `${process.env.API_HOST}`;
/* 加密 */
const getAuthorization = (config) => {
    const baseUriPrefix = 'yce-auth-';
    const uriSeparator = '/';
    const version = 'v1';
    const timestamp = getTimestamp();
    const expirationPeriodInSeconds = '60';

    const nstying = '\n';
    const Method = getRequestMethod(config.method);
    const CanonicalURI = getCanonicalURI(config.url)
    const CanonicalQueryString = getCanonicalQueryString(config.url);
    const CanonicalHeaders = '';

    const skStying =
        baseUriPrefix + version + uriSeparator + timestamp + uriSeparator + expirationPeriodInSeconds; // 前面拼接好的
    const autStying = Method + nstying + CanonicalURI + nstying + CanonicalQueryString + nstying + CanonicalHeaders; // 后面拼的
    // const data = HMAC_SHA256_HEX(skStying, autStying);
    const data = HMAC_SHA256_HEX(autStying, skStying);
    return skStying + uriSeparator + data;
};

// 获取timestamp
const timestamp = fmt => {
    const now = new Date();
    const o = {
        'M+': now.getMonth() + 1, // 月份
        'd+': now.getDate(), // 日
        'h+': now.getHours(), // 小时
        'm+': now.getMinutes(), // 分
        's+': now.getSeconds(), // 秒
        'q+': Math.floor((now.getMonth() + 3) / 3), // 季度
        S: now.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${now.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
            );
        }
    }
    return fmt;
};

const getTimestamp = () => {
    return timestamp('yyyy-MM-ddThh:mm:ssZ');
};

const HMAC_SHA256_HEX = (sk, authStringPrefix) => {
    const hash = CryptoJS.HmacSHA256(sk, authStringPrefix);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    const hashIN = hashInBase64.toLowerCase();
    let val = '';
    for (let i = 0; i < hashIN.length; i += 1) {
        if (val === '') val = hashIN.charCodeAt(i).toString(16);
        else val += hashIN.charCodeAt(i).toString(16);
    }
    return val;
};

const compare = (property, desc) => {
    return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (desc == true) {
            //排序升序排列
            return value1 - value2;
        } else {
            return value2 - value1;
        }
    }
};

// 获取 ? 后面的参数
const getCanonicalQueryString = (url) => {
    const canonicalQueryString = url.substring(url.indexOf('?') + 1);
    const paramArr = canonicalQueryString.split('&');
    let encodeUriArray = [];
    paramArr.forEach((item, index) => {
        if (item.indexOf('=') !== -1) {
            const key = encodeURI(item.substring(0, item.indexOf("=")));
            const value = encodeURI(item.substring(item.indexOf("=") + 1));
            const encodeString = `${key}=${value}`;
            encodeUriArray.push({
                encodeString,
                asciiValue: encodeString.charCodeAt(),
            })
        } else {
            const key = encodeURI(item);
            const encodeString = `${key}=`;
            encodeUriArray.push({
                encodeString,
                asciiValue: encodeString.charCodeAt(),
            })
        }
    })
    encodeUriArray.sort(compare('asciiValue', true)); //升序排列
    const sortArray = encodeUriArray.map((item, index) => {
        return item.encodeString
    });
    return sortArray.join("&");
};

// 获取 ? 前面的参数
const getCanonicalURI = (url) => {
    let returnUrl = '';
    const canonicalURI = url.substring(0, url.indexOf('?'))
    if (canonicalURI.substring(0, 1) !== '/') {
        returnUrl = `/${canonicalURI}`
    } else {
        returnUrl = canonicalURI;
    }
    return encodeURI(returnUrl);
}

// 获取请求方式---大写
const getRequestMethod = (method) => {
    return method.toUpperCase();
}

// axios 配置
axios.defaults.timeout = 30000;
axios.defaults.baseURL = `${API_HOST}`;

// history.go(0);
// http request 拦截器);
axios.interceptors.request.use(
    (config) => {
        const newConfig = config;
        newConfig.headers['Content-Type'] = 'application/json';
        newConfig.headers['Cache-Control'] = 'no-cache';
        newConfig.headers.Pragma = 'no-cache';
        // newConfig.headers['If-Modified-Since'] = new Date();
        // newConfig.headers['Cache-Control'] = 'max-age=3600';
        newConfig.headers.Accept = 'application/json';
        // 自定义
        newConfig.headers['X-Request-ID'] = uuidv1();

        const accessToken = 'ice';
        if (accessToken) {
            newConfig.headers.Authorization = accessToken;
        }
        return newConfig;
    },
    (err) => {
        const error = err;
        return Promise.reject(error);
    },
);

// http response 拦截器
axios.interceptors.response.use(
    (response) => {
        if (response.status === 204) {
            return Promise.resolve(response);
        }

        const {
            success,
            errorCode,
            errorMsg
        } = response.data;

        if (success !== undefined && (!success || success === 'false')) {
            response.data = {
                failed: true
            };
            message.error(errorMsg || errorCode);
        }

        return Promise.resolve(response.data);
    },
    (error) => {
        const {
            response
        } = error;
        if (response) {
            const {
                status
            } = response;
            switch (status) {
                case 401:
                    {
                        logout();
                        break;
                    }
                case 403:
                    {
                        message.error(403);
                        break;
                    }
                case 500:
                    {
                        message.error(500);
                        break;
                    }
                default:
                    break;
            }
        }
        return Promise.reject(error);
    },
);

export default axios;