import React from 'react'
import  SearchHeader  from "../../components/SearchHeader"
import { Flex, Toast } from "antd-mobile"
import Filter from './components/Filter'
import { API } from "../../utils/api";
import { List, AutoSizer, WindowScroller, InfiniteLoader } from "react-virtualized"
import HouseItem from "../../components/HouseItem";
import {BASE_URL} from "../../utils/url";
import Sticky from "../../components/Sticky";
import NoHouse from "../../components/NoHouse";
import {getCurrentCity} from "../../utils";
import './index.css'

// 获取当前定位城市信息
// const { label, value } = JSON.parse(localStorage.getItem('zf_city'))

export default class HouseList extends React.Component {
    state = {
        // 列表数据
        list: [],
        // 总条数
        count: 0,
        // 数据是否加载中
        isLoading: false,
    };
    label = "";
    value = "";
    // 初始化实例属性
    filters = {};

    async componentDidMount() {
        const {label, value} = await getCurrentCity();
        this.label = label;
        this.value = value;
        this.searchHouseList();
    }

    // 获取房屋列表回调
    async searchHouseList() {
        this.setState({
            isLoading: true,
        })
        // 开启loding
        Toast.loading("加载中...", 0, null, false)
        const res = await API.get("/houses",{
                params:{
                    cityId: this.value,
                    ...this.filters,
                    start: 1,
                    end: 20,
                },
            });
        const { list, count } = res.data.body;
        //关闭loding
        Toast.hide();
        // 提示房源数量
        if (count !== 0 ) {
            Toast.info(`共找到${count}套房源`, 2, null, false)
        }

        this.setState({
            list,
            count,
            isLoading:false,
        })
    };

    // 接收Filter组件中筛选条件数据
    onFilter = (filters) => {
        // 返回顶部
        window.scrollTo(0, 0)

        this.filters = filters;
        // 调用获取房源数据方法
        this.searchHouseList();
    };

    renderHouseList = ({key, index, style}) => {
        // 根据索引号获取当前这一行房屋数据
        const { list } = this.state;
        const house = list[index];

        // 判断house是否存在
        // 不存在渲染loading元素
        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className="houselist-loading"></p>
                </div>
            )
        }
        return <HouseItem
            onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
            key={key}
            style={style}
            src={BASE_URL + house.houseImg}
            title={house.title}
            desc={house.desc}
            tags={house.tags}
            price={house.price}
        />
    };

    //判断列表中每一行数据是否加载完毕
    isRowLoaded = ({index}) => {
        return !!this.state.list[index];
    };
    // 获取更多房屋列表数据 返回一个promise对象，在数据加载完成时调用resolve让promise对象状态变为已完成
    loadMoreRows = ({startIndex, stopIndex}) => {
        return new Promise(resolve => {
            API.get("/houses",{
                params:{
                    cityId: this.value,
                    ...this.filters,
                    start: startIndex,
                    end: stopIndex,
                },
            }).then((res) => {
                this.setState({
                    list: [...this.state.list,...res.data.body.list]
                });
                // 数据加载完成调用resolve
                resolve();
            })
        })
    };

    // 渲染列表数据
    renderList() {
        const { count , isLoading} = this.state;
        if (count === 0 && !isLoading) {
            return <NoHouse>没有找到房源，请您换个搜索条件</NoHouse>
        }
        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
            >
                {({onRowsRendered, registerChild}) => (
                    <WindowScroller>
                        {({height, isScrolling, scrollTop}) => (
                            <AutoSizer>
                                {({width}) => (
                                    <List
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        autoHeight  // 设置高度为WindowScroller最终渲染的列表高度
                                        width={width}
                                        height={height}
                                        rowCount={count} // List列表项的总条目数
                                        rowHeight={120} // 每一行的高度
                                        rowRenderer={this.renderHouseList}  // 渲染列表像中每一行
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        )
    }

    render() {
        return (
            <div className="houseHeader-root">
                {/*顶部搜索导航*/}
                <Flex className="houseHeader">
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                    <SearchHeader cityName={ this.label } className="searchHeader"/>
                </Flex>

                {/*    条件筛选栏*/}
                <Sticky height={40}>
                    <Filter onFilter={this.onFilter}/>
                </Sticky>

                {/*    房屋列表*/}
                <div className="houseList-houseItem">
                {/*    房屋列表内容*/}
                    {this.renderList()}
                </div>
            </div>
        )
    }
}