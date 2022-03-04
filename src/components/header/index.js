/*eslint eqeqeq: ["off", "smart"]*/
import React, { Component } from "react";
import { Row, Col, Avatar } from "antd";
import "./index.scss";
import Cookies from "js-cookie";
import { connect } from "react-redux";

class Header extends Component {
  state = {
    userInfoStyle: {
      transform: "rotateY(90deg)",
      opacity: 1,
    },
    isShow: true,
    info: Cookies.get("info") ? JSON.parse(Cookies.get("info")) : {},
    list: [
      {
        name: "首页",
        path: "/main/home",
        activeArr: ["home"],
      },
      {
        name: "我的课程",
        path: "",
      },
      {
        name: "我的直播",
        path: "",
      },
      {
        name: "批改作业",
        path: "",
      },
      {
        name: "我的作业库",
        path: "",
      },
      {
        name: "资源中心",
        path: "",
      },
      {
        name: "试题中心",
        path: "",
      },
    ],
  };
  // 个人中心
  PersonalCenter(e) {
    e.stopPropagation();
    if (this.state.isShow) {
      this.setState({
        userInfoStyle: {
          transform: "rotateY(0)",
          opacity: 1,
        },
        isShow: false,
      });
    }
    if (!this.state.isShow) {
      this.setState({
        userInfoStyle: {
          display: "none",
        },
        isShow: true,
      });
    }
  }
  onClickLike = (v) => {
    if (v.path) {
      this.props.history.push(v.menuUrl);
    }
  };
  render() {
    let { navName, menuList } = this.props;
    const { imgSrc } = window;
    const { list, info } = this.state;
    let pathname = this.props.location.pathname;
    return (
      <div className="header-wrap-stud">
        <Row type="flex" justify="space-around" className="row-flex">
          <Col span={6}>
            <div className="tohome-left">
              <img
                src={imgSrc + "logo.png"}
                style={{
                  marginLeft: 30,
                  verticalAlign: "-2px",
                  width: "237px",
                  height: "32px",
                }}
                alt=""
              />
              {/* </Link> */}
            </div>
          </Col>
          <Col span={15}>
            <div className="tohome">
              {menuList &&
                menuList.map((v, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        this.onClickLike(v);
                      }}
                    >
                      <span
                        className={`common-header-item ${
                          pathname.includes(v.menuUrl) ? "common-active" : ""
                        }`}
                      >
                        {/* <span
                      className={`common-header-item ${v.activeArr&&v.activeArr.includes(navName)?'common-active':''}`}
                    > */}
                        {v.menuName}
                      </span>
                    </div>
                  );
                })}
            </div>
          </Col>
          <Col span={3} className="header-right">
            <span className="header-right-name">{info.fullName}</span>
            <Avatar
              src={`https://zjyddev.oss-cn-beijing.aliyuncs.com/${info.portraitId}`}
              onClick={(e) => {
                this.PersonalCenter(e);
              }}
            />
            <div className="userinfo-modal" style={this.state.userInfoStyle}>
              <span></span>
              <p>个人中心</p>
              <p onClick={this.handleLogout}>退出</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;
