import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
// import axios from 'axios'
import { API } from '../../utils/api'
import {BASE_URL} from '../../utils/url'
import {getCurrentCity} from "../../utils";
import SearchHeader from '../../components/SearchHeader'

// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入样式文件
import './index.css'

// 导航菜单数据
const navs = [
    {
        id: 0,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 1,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav3,
        title: '地图找房',
        path: '/home/map'
    },
    {
        id: 3,
        img: Nav4,
        title: '去出租',
        path: '/rent/add'
    }
]

// 获取地理位置信息
navigator.geolocation.getCurrentPosition( position => {
    console.log(1)
})

export default class Index extends React.Component {
    state = {
        // 轮播图状态
        swipers: [],
        isSwipersLoaded: false,

        // 租房的状态
        groups: [],

        // 最新咨询数据
        news: [],

        // 当前城市名称
        curCityName: "",
    }

    // 获取轮播图数据回调
    async getSwipers() {
        const res = await API.get('/home/swiper')
        this.setState({
            swipers: res.data.body,
            isSwipersLoaded: true
        })
    }

    // 获取租房小组回调
    async getGroups() {
        const res = await API.get('/home/groups', {
            params:{
                area: "AREA|88cff55c-aaa4-e2e0"
            }
        })
        let { data } = res
        this.setState({
            groups: data.body
        })
    }

    // 获取最新咨询回调
    async getNews() {
        const res = await API.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
        this.setState({
            news: res.data.body
        })
    }


    async componentDidMount() {
        // 获取轮播图
        this.getSwipers();
        // 获取租房小组
        this.getGroups();
        // 获取最新咨询
        this.getNews();

        // 通过IP获取当前城市信息
        // const curCity = new window.BMapGL.LocalCity()
        // curCity.get(async ( res ) => {
        //     const result = await axios.get(
        //         `http://localhost:8080/area/info?name=${res.name}`
        //     );
        //     this.setState({
        //         curCityName: result.data.body.label
        //     })
        // })

        const curCity = await getCurrentCity()
        this.setState({
            curCityName: curCity.label
        })
    }



    // 渲染轮播图
    renderSwipers() {
        return this.state.swipers.map(item => (
            <a
                key={item.id}
                href="http://www.alipay.com"
                style={{display: 'inline-block', width: '100%', height: 212}}
            >
                <img
                    src={BASE_URL + item.imgSrc}
                    alt=""
                    style={{width: '100%', verticalAlign: 'top'}}
                />
            </a>
        ))
    }

    // 渲染导航菜单
    renderNav() {
        return navs.map(item => (
            <Flex.Item
                key={item.id}
                onClick={() => {
                    this.props.history.push(item.path)
                }}
            >
                <img src={item.img} alt=""/>
                <h2>{item.title}</h2>
            </Flex.Item>
        ))
    }

    // 渲染租房小组
    renderGroups (item) {
        return (
            <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                    <p className="title">{item.title}</p>
                    <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt=""/>
            </Flex>
        )
    }

    // 渲染最新咨询
    renderNews () {
        return this.state.news.map(item => {
            return (
                <div className="news-item" key={item.id}>
                    <div className="imgWrap">
                        <img src={`http://localhost:8080${item.imgSrc}`}  className="img" alt=""/>
                    </div>
                    <Flex className="content" direction="column" justify="between">
                        <h3 className="title">{item.title}</h3>
                        <Flex className="info" justify="between">
                            <span>{item.from}</span>
                            <span>{item.date}</span>
                        </Flex>
                    </Flex>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="index">
                {/*轮播图*/}
                <div className='swiper'>
                    {this.state.isSwipersLoaded? (<Carousel
                        autoplay={true}
                        autoplayInterval={5000}
                        infinite
                    >
                        {this.renderSwipers()}
                    </Carousel>) : ("")}

                {/*    搜索框*/}
                    <SearchHeader cityName={this.state.curCityName} />

                </div>

            {/*    导航菜单*/}
                <Flex className="nav">
                    {this.renderNav()}
                </Flex>

            {/*    租房小组*/}
            <div className="group">
                <h3 className="group-title">
                    租房小组
                    <span className="more">更多</span>
                </h3>

                <Grid data={this.state.groups}
                      square={false}
                      hasLine={false}
                      columnNum={2}
                      renderItem = {(item) => this.renderGroups(item)}
                />
            </div>

            {/*    获取最新咨询*/}
                <div className="news">
                    <h3 className="group-title">最新咨询</h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>
            </div>




        );
    }
}