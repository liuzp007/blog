/* eslint-disable react/react-in-jsx-scope */
import React, { Component } from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Moment from "moment";
import "moment/locale/zh-cn";
Moment.locale("zh-cn");

let resetAntd = (Com) => {
  return class extends Component {
    render() {
      return (
        <ConfigProvider locale={zhCN}>
          <Com />
        </ConfigProvider>
      );
    }
  };
};

export default resetAntd;
