/*eslint eqeqeq: ["off", "smart"]*/
import { Component } from 'react';
import axios from 'axios';
// import { message } from "antd";
import md5 from 'js-md5';
import messageObj from './err_code';
import Cookies from 'js-cookie';
import { baseURL, loginOutUrl, app } from '@/config/secret';
let message = Component.prototype;
let requestFlag = true;
const Http = axios.create({
    timeout: 15000,
    // withCredentials: false,
    baseURL,
});

//同一个接口 上次请求没有响应之前 禁止再次请求
let requestingUrl = [];

Http.interceptors.request.use(
    (config) => {
        let index = requestingUrl.findIndex((v) => v.url === config.url);
        if (index !== -1) {
            message.mesWarning('请勿重复请求！');
        } else {
            requestingUrl.push({
                url: config.url,
                data: config.data,
            });
            let now = new Date().getTime();
            config.headers = {
                ...config.headers,
                'z-ts': now,
                'z-sign': md5(now + ''),
            };
            if (
                (config.data && config.data.isBlob) ||
                (config.params && config.params.isBlob)
            ) {
                config.responseType = 'blob';
            }
            let token = Cookies.get('info')
                ? JSON.parse(Cookies.get('info')).token
                : '';
            token && (config.headers.token = token);
            return config;
        }
    },
    (error) => {
        Promise.reject(error).catch((e) => { });
    }
);
Http.interceptors.response.use(
    (response) => {
        let config = response.config;
        let index = requestingUrl.findIndex((v) => v.url === config.url);
        if (index !== -1) {
            requestingUrl.splice(index, 1);
        }
        const res = response.data;
        if (
            res.code === 551005 ||
            res.code === 551004 ||
            res.code === 551002 ||
            res.code === 551003
        ) {
            window.location = `${loginOutUrl}?url=${app['AT']}`;
        } else if (
            res.code === 0 ||
            (response.config && response.config.responseType === 'blob')
        ) {
            return res;
        } else if (res.code === undefined) {
            return res;
        } else {
            return Promise.reject(res);
        }
    },
    (err) => {
        if (err.response && err.response.status) {
            if (err.response.status === 401) {
                if (requestFlag) {
                    requestFlag = false;
                    message.mesWarning('您的登录已过期，请重新登录');
                    setTimeout(() => { }, 1000);
                }
            } else {
                message.mesWarning('哎呀，有意外了，攻城狮正火速来援');
            }
        }
    }
);
export const get = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        Http.get(url, params)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (err.code != 0) {
                    if (messageObj[err.code]) {
                        message.mesWarning(messageObj[err.code]);
                        return;
                    }
                    reject(err)
                    message.mesError(err.message);
                }
            });
    });
};
export const post = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        Http.post(url, params)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (err.code != 0) {
                    if (messageObj[err.code]) {
                        message.mesWarning(messageObj[err.code]);
                        return;
                    }
                    reject(err)
                    message.mesError(err.message);
                }
            });
    });
};
export const del = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        Http.delete(url, { params: params })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (err.code != 0) {
                    if (messageObj[err.code]) {
                        message.mesWarning(messageObj[err.code]);
                        return;
                    }
                    reject(err)
                    message.mesError(err.message);
                }
            });
    });
};

export const put = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        Http.put(url, params)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (err.code != 0) {
                    if (messageObj[err.code]) {
                        message.mesWarning(messageObj[err.code]);
                        return;
                    }
                    reject(err)
                    message.mesError(err.message);
                }
            });
    });
};

export default Http;
