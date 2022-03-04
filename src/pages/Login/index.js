import React, {Component} from "react";
import {Link} from "react-router-dom";
import NavHeader from "../../components/NavHeader";
import {WhiteSpace, WingBlank, Flex, Toast} from "antd-mobile";
import "./index.css";
import {API} from "../../utils/api";
import {withFormik, Form, Field, ErrorMessage} from "formik";
import * as yup from 'yup';

// 验证规则
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/
class Login extends React.Component{
    render() {
        return (
            <div className="login-root">
                {/*    顶部导航*/}
                <NavHeader className="login-navheader">账号登录</NavHeader>
                <WhiteSpace size="xl" />

                {/*    登录表达*/}
                <WingBlank>
                    <Form>
                        <div className="login-formItem">
                            <Field
                                className="login-input"
                                name="username"
                                placeholder="请输入账号"
                            />
                        </div>
                        <ErrorMessage className="login-error" name="username" component="div" />
                    {/*    长度5-8为数字字母下划线*/}
                    {/*    <div className="login-error">账号为必填项</div>*/}


                        <div className="login-formItem">
                            <Field
                                className="login-input"
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                            />
                        </div>
                        <ErrorMessage className="login-error" name="password" component="div" />
                        {/*    长度5-12为数字字母下划线*/}
                        {/*    <div className="login-error">密码为必填项</div>*/}

                        <div className="login-formSubmit">
                            <button className="login-submit" type="submit">登 录</button>
                        </div>
                    </Form>

                    <Flex>
                        <Flex.Item className="login-backHome">
                            <Link to="registe">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}

Login = withFormik({
    // 提供状态
    mapPropsToValues: () => ({username: "", password: ""}),

    // 添加表单校验规则
    validationSchema: yup.object().shape({
        username: yup.string().required("账号为必填项").matches(REG_UNAME,"长度为5-8位，只能出现数字、字母、下划线"),
        password: yup.string().required("密码为必填项").matches(REG_PWD,"长度为5-12位，只能出现数字、字母、下划线"),
    }),
    // 表单提交事件
    handleSubmit: async (values, {props}) => {
        // 获取账号和密码
            const {username, password} = values;

            // 发生请求
            const res = await API.post("/user/login", {
                username,
                password,
            });
            const {status, body, description} = res.data;
            if (status === 200) {
                // 登录成功
                localStorage.setItem("zf_token", body.token);
                if (!props.location.state) {
                    // 表示直接进入该页面
                    props.history.go(-1);
                }else {
                    props.history.replace(props.location.state.from.pathname)
                }
            }else {
                Toast.info(description, 2, null, false)
            }
    },
})(Login);

// 返回的是高阶组件包裹后的Login
export default Login;