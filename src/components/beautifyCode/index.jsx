
import React from "react";
import Prism from "prismjs";
import 'prismjs/themes/prism.css';
import './index.scss'
const BeautifyCode = ({ code }) => {
    
    return code && <pre className="language-js line-numbers">
        <code className="language-js" dangerouslySetInnerHTML={{
            __html: Prism.highlight(code, Prism.languages.javascript, 'css')
        }}></code>
    </pre>
}
const BeautifyCodeList = ({ list }) => {
    let node = []
    if (Array.isArray(list))  node = list.map((i, index) => <BeautifyCode code={i} key={index} />)
    else node = Object.keys(list).map((i, index) => <BeautifyCode code={list[i]} key={index} />)
    return node
}
export default BeautifyCode
export { BeautifyCode, BeautifyCodeList }
