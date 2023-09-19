import React from 'react'
import Body from "../../../../components/bodyComponent";
let data = {
    1: `import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
    // 自定义 hook 用于获取 cookie 值
    function useCookie(cookieName) {
        const [cookieValue, setCookieValue] = useState(null);
    
        useEffect(() => {
        // 获取 cookie 值
        const value = Cookies.get(cookieName);
        setCookieValue(value);
        }, [cookieName]);
    
        // 设置 cookie 值
        const setCookie = (value, options) => {
        Cookies.set(cookieName, value, options);
        setCookieValue(value);
        };
    
        // 删除 cookie
        const removeCookie = () => {
        Cookies.remove(cookieName);
        setCookieValue(null);
        };
    
        return [cookieValue, setCookie, removeCookie];
    }
export default useCookie;`,
}
export default function UseCustomHooks() {
    return (
        <Body title={"useLayoutEffect"} data={data} />
    )
}
