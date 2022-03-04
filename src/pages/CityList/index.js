import React from 'react'
import { Toast } from 'antd-mobile';
import { List, AutoSizer } from 'react-virtualized'
// import axios from "axios";
import { API } from '../../utils/api'
import { getCurrentCity } from "../../utils"
import NavHeader from "../../components/NavHeader";
import "./index.css"

// 数据格式方法
const formatCityList = (list) => {
        const cityList=  {};
        // 遍历list数组
    list.forEach((item) => {
        // 获取每个城市首字母
        const first = item.short.substr(0,1)
        // 判断cityList中是否有该分类
        if (cityList[first]) {
            // 有则直接往里面push数据
            cityList[first].push(item)
        }else{
            // 没有就先创建一个 在存数据
            cityList[first] = [item]
        }
    });
        // 获取索引数据
        const cityIndex = Object.keys(cityList).sort();

    return {
        cityList,
        cityIndex,
    }
}

// 封装处理字母索引方法
const formatCityIndex = (letter) => {
    switch(letter) {
        case "#" :
            return "当前定位";
        case "hot" :
            return "热门城市";
        default :
            return letter.toUpperCase();
    }

}

// 索引的高度
const TITLE_HEIGHT = 36;
// 城市名称高度
const  NAME_HEIGHT = 50;

// 有房源的城市
const HOUSE_CITY = ['北京','上海','广州','深圳']



export default class CityList extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            cityList: {},
            cityIndex: [],
            // 指定右侧字母高亮
            activeIndex: 0
        };
        // 创建ref对象
        this.cityListComponent = React.createRef()
    }

    async componentDidMount() {
        await this.getCityList()

        // 调用measureAllRows提前计算List中每一行高度，实现scrollToRow精确跳转
        this.cityListComponent.current.measureAllRows()
    }

    async getCityList() {
        const res = await API.get('/area/city?level=1');
        const {cityList, cityIndex} = formatCityList(res.data.body);

        // 获取热门城市列表
        const hotRes = await API.get('/area/hot')
        cityList["hot"] = hotRes.data.body
        cityIndex.unshift("hot")

        // 获取当前定位城市信息
        const curCity = await getCurrentCity();

        cityList["#"] = [curCity];
        cityIndex.unshift("#")

        this.setState({
            cityList,
            cityIndex,
        })
    }

    rowRenderer = ({
                       key,
                       index,
                       isScrolling,
                       isVisible,
                       style
    }) => {
        const { cityIndex, cityList } =this.state;
        const letter = cityIndex[index];
        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map((item) => (
                        <div
                            className="name"
                            key={item.value}
                            onClick={() => {
                                this.changeCity(item)
                            }}
                        >
                            {item.label}
                        </div>))
                }
            </div>
        );
    }

    getRowHeight = ( {index} ) => {
        const { cityList, cityIndex } = this.state;
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
    };

    // 封装渲染右侧索引列表方法
    renderCityIndex = () => {
        const {cityIndex, activeIndex} = this.state;
        return cityIndex.map((item, index) => (
                <li className="city-index-item" key={item} onClick={() => {
                    this.cityListComponent.current.scrollToRow(index)
                }}>
                    <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot'? '热' : item.toUpperCase()}</span>
                </li>
            ),
        )
    };

    // 切换城市
    changeCity({label, value}) {
        if (HOUSE_CITY.indexOf(label) > -1) {
            localStorage.setItem('zf_city', JSON.stringify({label, value}));
            this.props.history.go(-1);
        }else{
            Toast.info('该城市暂无房源数据', 1, null, false);
        }
    }

    onRowsRendered = ({ startIndex }) => {
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex,
            })
        }
    }

    render() {
            return <div className="citylist">
                    {/*顶部导航栏*/}
                    <NavHeader>城市选择</NavHeader>

                    {/*    城市列表*/}
                        <AutoSizer>
                            {({height, width}) => (
                                <List
                                    ref={this.cityListComponent}
                                    width={width}
                                    height={height}
                                    rowCount={this.state.cityIndex.length}
                                    rowHeight={this.getRowHeight}
                                    rowRenderer={this.rowRenderer}
                                    onRowsRendered={this.onRowsRendered}
                                    scrollToAlignment="start"
                                />
                            )}
                        </AutoSizer>

                    {/*    右侧索引列表*/}
                    <ul className="city-index">
                        {this.renderCityIndex()}
                    </ul>
                    </div>
    }
}