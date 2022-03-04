import React, { Component } from "react";

import { SearchBar } from "antd-mobile";

import { getCity } from "../../../utils/city";
import { API } from "../../../utils/api";

import "./index.css"

export default class Search extends Component {
    // 当前城市id
    cityId = getCity().value;
    // 定时器id
    timerId = null;

    state = {
        // 搜索框的值
        searchTxt: "",
        tipsList: [],
    };

    // 关键词搜索小区信息
    handleSearchTxt = (value) => {
        this.setState({
            searchTxt: value
        });
        if (!value) {
            return this.setState({
                tipsList: [],
            });
        }
        // 清除上一次定时器
        clearTimeout(this.timerId)

        this.timerId = setTimeout(async () => {
            // 发送请求获取小区数据
            const res = await API.get("/area/community", {
                params: {
                    name: value,
                    id: this.cityId,
                }
            })
            this.setState({
                tipsList: res.data.body,
            })
        },500)
    };

    onTipsClick = (item) => {
        this.props.history.replace("/rent/add", {
            name: item.communityName,
            id: item.community,
        })
    };

    // 渲染搜索结果列表
    renderTips = () => {
        const { tipsList } = this.state;

        return tipsList.map((item) => (
            <li
                key={item.community}
                className="search-tip"
                onClick={() => this.onTipsClick(item)}
            >
                {item.communityName}
            </li>
        ));
    };

    render() {
        const { history } = this.props;
        const { searchTxt } = this.state;

        return (
            <div className="search-root">
                {/* 搜索框 */}
                <SearchBar
                    placeholder="请输入小区或地址"
                    value={searchTxt}
                    onChange={this.handleSearchTxt}
                    showCancelButton={true}
                    onCancel={() => history.replace("/rent/add")}
                />

                {/* 搜索提示列表 */}
                <ul className="search-tips">{this.renderTips()}</ul>
            </div>
        );
    }
}
