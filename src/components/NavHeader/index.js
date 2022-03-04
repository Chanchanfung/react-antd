import React from 'react'
import { NavBar} from "antd-mobile";
import PropTypes from 'prop-types';
import './index.css'
// import styles from './index.module.css'


// 导入withRouter 高阶组件
import { withRouter } from 'react-router-dom'

function NavHeader({ children, history, onLeftClick, className, rightContent }) {
    // 默认点击行为
    const defaultHandler = () => {
        history.go(-1)
    }
    return(
        <NavBar
            className={["navbar", className || ""].join(" ")}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={onLeftClick || defaultHandler}
            rightContent={rightContent}
        >
            {children}
        </NavBar>
    )
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func,
    className: PropTypes.string,
    rightContent:PropTypes.array,
}

export default withRouter(NavHeader);