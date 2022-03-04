import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Grid, Button, Modal } from "antd-mobile";

import { BASE_URL } from "../../utils/url";
import { API } from "../../utils/api";
import { isAuth, getToken, removeToken } from "../../utils/auth";
import "./index.css"

// 菜单数据
const menus = [
    { id: 1, name: "我的收藏", iconfont: "icon-coll", to: "/favorate" },
    { id: 2, name: "我的出租", iconfont: "icon-ind", to: "/rent" },
    { id: 3, name: "看房记录", iconfont: "icon-record" },
    {
        id: 4,
        name: "成为房主",
        iconfont: "icon-identity",
    },
    { id: 5, name: "个人资料", iconfont: "icon-myinfo" },
    { id: 6, name: "联系我们", iconfont: "icon-cust" },
];

// 默认头像
const DEFAULT_AVATAR = BASE_URL + "/img/profile/avatar.png";

const alert = Modal.alert;

export default class Profile extends Component {
    state = {
        // 是否登录
        isLogin: isAuth(),
        // 用户信息
        userInfo: {
            avatar: "",
            nickname: "",
        }
    };

    componentDidMount() {
        this.getUserInfo();
    }

    async getUserInfo() {
        if (!this.state.isLogin) {
            // 未登录
            return;
        }

        // 发送请求
        const res = await API.get("/user", {
            headers: {
                authorization: getToken()
            }
        })
        if (res.data.status === 200) {
            const {avatar, nickname} = res.data.body;
            this.setState({
                userInfo: {
                    avatar: BASE_URL + avatar,
                    nickname,
                }
            })
        }
    };

    // 退出
    logout = () => {
        alert('提示', '是否确定退出?', [
            { text: '取消' },
            { text: '退出', onPress: () => {
                // 调用退出接口
                    API.post("/user/logout", null, {
                        // headers: {
                        //     authorization: getToken(),
                        // }
                    })
                    // 移除本地token
                    removeToken();

                    // 处理状态
                    this.setState({
                        isLoading: false,
                        userInfo: {
                            avatar: "",
                            nickname: "",
                        }
                    })
                } },
        ])
    }
    render() {
        const { history } = this.props;
        const { isLogin, userInfo:{avatar, nickname} } = this.state;

        return (
            <div className="profile-root">
                {/* 个人信息 */}
                <div className="profile-title">
                    <img
                        className="profile-bg"
                        src={BASE_URL + "/img/profile/bg.png"}
                        alt="背景图"
                    />
                    <div className="profile-info">
                        <div className="profile-myIcon">
                            <img
                                className="profile-avatar"
                                src={avatar || DEFAULT_AVATAR}
                                alt="icon"
                            />
                        </div>
                        <div className="profile-user">
                            <div className="profile-name">{nickname || "游客"}</div>

                            {isLogin? (
                                // 已登录
                                <>
                                    <div className="profile-auth">
                                        <span onClick={this.logout}>退出</span>
                                    </div>
                                    <div className="profile-edit">
                                        编辑个人资料
                                        <span className="profile-arrow">
                                        <i className="iconfont icon-arrow" />
                                      </span>
                                    </div>
                                </>
                            ) : (
                                // 未登录
                                <div className="profile-edit">
                                    <Button
                                    type="primary"
                                    size="small"
                                    inline
                                    onClick={() => history.push("/login")}
                                    >
                                    去登录
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 九宫格菜单 */}
                <Grid
                    data={menus}
                    columnNum={3}
                    hasLine={false}
                    renderItem={(item) =>
                        item.to ? (
                            <Link to={item.to}>
                                <div className="profile-menuItem">
                                    <i className={`iconfont ${item.iconfont}`} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        ) : (
                            <div className="profile-menuItem">
                                <i className={`iconfont ${item.iconfont}`} />
                                <span>{item.name}</span>
                            </div>
                        )
                    }
                />

                {/* 加入我们 */}
                <div className="profile-ad">
                    <img src={BASE_URL + "/img/profile/join.png"} alt="" />
                </div>
            </div>
        );
    }
}
