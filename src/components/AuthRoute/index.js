import React from "react";
import { Route, Redirect } from "react-router-dom";
import {isAuth} from "../../utils/auth";

const AuthRoute = ({component: Component, ...res }) => {
    return <Route
        {...res}   // 结构传过来的剩余参数
        render={props => {
        const isLoging = isAuth();

        if (isLoging) {
            // 已登录状态 直接渲染该组件
            return <Component {...props} />
        }else {
            // 未登录
            return <Redirect to={
                {
                    pathname: "/login",
                    state:{
                        from: props.location,    // 获取在地址栏手动输入的地址
                    }
                }
            } />
        }
    }} />
}

export default AuthRoute;