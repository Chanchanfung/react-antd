import React from 'react';
import {Flex} from "antd-mobile";
import './index.css'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

function SearchHeader({ history, cityName, className}) {
    return (
        <Flex className={["search-box", className || ""].join(" ")}>
            {/*    左侧*/}
            <Flex className="search">
                {/*    位置*/}
                <div
                    className="location"
                    onClick={() => history.push("/citylist")}
                >
                    <span className="name">{cityName}</span>
                    <i className="icon icon-arrow" />
                </div>
                {/*    搜索表单*/}
                <div
                    className="form"
                    onClick={() => history.push("/search")}
                >
                    <i className="iconfont icon-seach" />
                    <span className="text">请输入小区或地址</span>
                </div>
            </Flex>
            {/*    右侧*/}
            <i
                className="iconfont icon-map"
                onClick={() => history.push("/map")}
            />
        </Flex>
    )
}

SearchHeader.propTypes = {
    cityName: PropTypes.string.isRequired,
}

export default withRouter(SearchHeader)