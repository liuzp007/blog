import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './reset_style/index.scss'
import './index.css';
import { getImageOssBaseurl } from './api/Baseurl';
import store from './redux';
import { Provider } from 'react-redux';
import '@/components/global_components/confirm/index.css';
import '@/components/global_components/confirm/index.js';
import { initSecretUrlByType07, baseURL } from './config/secret';
import Http from './utils/axios_instans';
window.apiPrefix = '/api/exam';
function create(src) {
    return function (path) {
        if (!path) return;
        if (path.indexOf('/') === 0) {
            return src + path.slice(1);
        } else {
            return src + path;
        }
    };
}
const getImgSrc = new Promise(res=>res({result:{}}));
getImgSrc.then((res) => {
    if (res) {
        res = res.result;
        // window.$$imgSrc = create(res.config['public-resource']);
        // window.$$newSrc = create(res.config['static-img']);
        document.title = 'Blog'; //title
        // document.querySelector('link[rel="icon"]').href = 'javaScript:;'; //ico'
        // if (res?.config) {
        //     initSecretUrlByType07(undefined);
        //     // Http.defaults.baseURL = baseURL;
        // }
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root')
        );
    }
});
// window.$$imgSrc = () => {};
// ReactDOM.render(<App />, document.getElementById("root"));
