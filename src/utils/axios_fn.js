import { Spin } from 'antd';



let needLoadingRequestCount = 0;

export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

function startLoading() {
    let div = document.querySelector('.loading_box');
    if (div) {
        div.style.display = 'block';
    }
}

function endLoading() {
    let div = document.querySelector('.loading_box');
    if (div) {
        div.style.display = 'none';
    }
}