
import React from "react";
import Prism from "prismjs";
import 'prismjs/themes/prism.css';
import './index.scss'
const BeautifyCode = ({ code }) => {
    return <pre className="language-js line-numbers">
        <code className="language-js" dangerouslySetInnerHTML={{
            __html: Prism.highlight(code, Prism.languages.javascript, 'css')
        }}></code>
    </pre>
}
export default BeautifyCode
export { BeautifyCode }