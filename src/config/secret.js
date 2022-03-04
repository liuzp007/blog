export let baseURL = 'https://gw-test.cvei.cn';
export let domainUrl = ''; // 主域名
export let loginUrl = ''; //登录中心
export let loginOutUrl = ''; //登录中心  --- 退出
export let app = {}; //跳转其他项目

export const setBaseUrl = (url) => {
    baseURL = url;
};

export const setDomain = (url) => {
    domainUrl = url;
};

export const setLoginUrl = (url) => {
    loginUrl = url;
};

export const setLoginOutUrl = (url) => {
    loginOutUrl = url;
};

export const setAppUrl = (url) => {
    app.AT = url + '/#';
};

// 依赖07接口
export const initSecretUrlByType07 = (config) => {
    setBaseUrl(config?.gw ?? '');
    let domain = config?.gw
        ?.split('.')
        .reverse()
        .slice(0, 2)
        .reverse()
        .join('.');
    setDomain(domain ? `.${domain}` : '');
    setLoginUrl(config?.sys?.logincenter ?? '');
    setLoginOutUrl(config?.sys?.logoutcenter ?? '');
    setAppUrl(config?.sys?.gerenkongjian ?? '');
};
