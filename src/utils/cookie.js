import Cookies from 'js-cookie';
import { domainUrl } from '@/config/secret.js';
const key = 'info';

export const setCookieToken = (value, time) => {
    Cookies.set(key, value, { path: '/', expires: time, domain: domainUrl });
}

export const removeCookieToken = ()=>{
    Cookies.remove(key,{path:'/',domain:domainUrl});
}

//获取用户登录信息
export const getCookieInfo = () => {
    return Cookies.get(key) ? JSON.parse(Cookies.get(key)) : {};
}