import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import RouterView from './router/router_view';
import { message } from 'antd';
import routers from './router/router_config';
import resetAntd from './config/antd_global';
message.config({
    duration: 3, // 持续时间
    top: `40vh`, // 到页面顶部距离
    maxCount: 3, // 最大显示数, 超过限制时，最早的消息会被自动关闭
});
class App extends Component {
    render() {
        return (
            <HashRouter>
                <RouterView routers={routers}></RouterView>
            </HashRouter>
        );
    }
}
App = resetAntd(App);

export default App;
