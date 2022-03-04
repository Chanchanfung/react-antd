import React, {Component} from "react";
import "./index.css";
import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";
import HousePackage from "../../components/HousePackage";
import {Carousel, Flex, Modal, Toast} from "antd-mobile";
import {BASE_URL} from "../../utils/url";
import {API} from "../../utils/api";
import {isAuth} from "../../utils/auth";

// 猜你喜欢
const recommendHouses = [
    {
        id: 1,
        src: BASE_URL + "/img/message/1.png",
        desc: "72.32㎡/南 北/低楼层",
        title: "安贞西里 3室1厅",
        price: 4500,
        tags: ["随时看房"],
    },
    {
        id: 2,
        src: BASE_URL + "/img/message/2.png",
        desc: "83㎡/南/高楼层",
        title: "天居园 2室1厅",
        price: 7200,
        tags: ["近地铁"],
    },
    {
        id: 3,
        src: BASE_URL + "/img/message/3.png",
        desc: "52㎡/西南/低楼层",
        title: "角门甲4号院 1室1厅",
        price: 4300,
        tags: ["集中供暖"],
    },
];

// 百度地图
const BMap = window.BMap;

const labelStyle = {
    position: "absolute",
    zIndex: -7982820,
    backgroundColor: "rgb(238, 93, 91)",
    color: "rgb(255, 255, 255)",
    height: 25,
    padding: "5px 10px",
    lineHeight: "14px",
    borderRadius: 3,
    boxShadow: "rgb(204, 204, 204) 2px 2px 2px",
    whiteSpace: "nowrap",
    fontSize: 12,
    userSelect: "none",
};

const alert = Modal.alert;


export default class HouseDetail extends Component {
    state = {
        // 数据加载中状态
        isLoading: false,
        // 房屋详情
        houseInfo: {
            // 房屋图片
            houseImg: [],
            // 标题
            title: "",
            // 标签
            tags: [],
            // 租金
            price: 0,
            // 房型
            roomType: "两室一厅",
            // 房屋面积
            size: 89,
            // 装修类型
            renovation: "精装",
            // 朝向
            oriented: [],
            // 楼层
            floor: "",
            // 小区名字
            community: "",
            // 地理位置
            coord: {
                latitude: "39.928033",
                longitude: "116.529466",
            },
            // 房屋配套
            supporting: [],
            // 房屋标识
            houseCode: "",
            // 房屋描述
            description: "",
        },
        // 表示房源是否收藏
        isFavorite: false,
    };

    componentDidMount() {
        // 获取房屋数据
        this.getHouseDetail();
        // 检测房源是否收藏
        this.checkFavorite();
    }

    async getHouseDetail() {
        const {id} = this.props.match.params;
        // 开启loading
        this.setState({
            isLoading: true,
        })
        const res = await API.get(`/houses/${id}`)
        this.setState({
            houseInfo: res.data.body,
            isLoading: false
        })

        const {community, coord} = res.data.body;

        this.renderMap(community, coord)
    };

    async checkFavorite() {
        const isLogin = isAuth();
        if (!isLogin) {
            return;
        }
        // 已登录
        const {id} = this.props.match.params;
        const res = await API.get(`/user/favorites/${id}`);

        const {status, body} = res.data;
        if (status === 200 ) {
            // 请求成功，更新isFavorite
            this.setState({
                isFavorite:body.isFavorite,
            })
        }
    };

    handleFavorite = async () => {
        const isLogin = isAuth();
        const {history, location, match} = this.props;
        if (!isLogin) {
            // 未登录
            alert('提示', '登录后才能收藏房源，是否去登录？', [
                { text: '取消'},
                { text: '去登录', onPress: () => history.push("/login", {from: location}) },
            ])
        }
        const {isFavorite} = this.state;
        const {id} = match.params;
        if (isFavorite) {
            // 已收藏
            const res = await API.delete(`/user/favorites/${id}`);
            this.setState({
                isFavorite: false,
            });
            if (res.data.status === 200 ) {
                // 提示用户
                Toast.info("已取消收藏", 1, null, false)
            } else {
                // token 超时
                Toast.info("登录超时请重新登录", 2, null, false)
            }
        }else {
            // 未收藏则添加收藏
            const res = await API.post(`/user/favorites/${id}`);
            if (res.data.status === 200 ) {
                // 提示用户
                Toast.info("已收藏", 1, null, false)
                this.setState({
                    isFavorite: true,
                })
            } else {
                // token 超时
                Toast.info("登录超时请重新登录", 2, null, false)
            }
        }
    }

    // 渲染轮播图
    renderSwipers() {
        const {houseInfo:{houseImg}} = this.state;
        return houseImg.map(item => (
            <a
                key={item}
                href="http://www.alipay.com"
            >
                <img
                    src={BASE_URL + item}
                    alt=""
                />
            </a>
        ))
    };

    // 渲染地图
    renderMap(community, coord) {
        const {latitude, longitude} = coord;
        const map = new BMap.Map("map")
        const point = new BMap.Point(longitude, latitude)
        map.centerAndZoom(point, 17)
        const label = new BMap.Label("", {
            position: point,
            offset: new BMap.Size(0, -36)
        })
        label.setStyle(labelStyle)
        label.setContent(`
        <span>${community}</span>
        <div class="housedetail-mapArrow"></div>
        `)
        map.addOverlay(label)

    }

    // 渲染标签
    renderTags() {
        const {
            houseInfo: {tags}
        } = this.state;
        return tags.map((item, index) => {
                let tagClass = ""
                if(index > 2) {
                    tagClass = "tag3"
                }else {
                    tagClass = "tag" + (index + 1)
                }
                return (
                    <span
                        className={`housedetail-tag housedetail-${tagClass}`}
                        key={item}
                    >
                                {item}
                    </span>
                )
        })
    }

    render() {
        const {
            isLoading,
            houseInfo:{community, title, price, roomType, size, floor, oriented, supporting, description},
            isFavorite,
        } = this.state;
        return(
            <div className="housedetail-root">
                {/*    导航栏*/}
                <NavHeader
                    className="housedetail-navHeader"
                    rightContent={[<i className="iconfont icon-share"></i>]}
                >
                    {community}
                </NavHeader>

                {/*轮播图*/}
                <div className='housedetail-slides'>
                    {!isLoading? (<Carousel
                        autoplay={true}
                        autoplayInterval={5000}
                        infinite
                    >
                        {this.renderSwipers()}
                    </Carousel>) : ("")}
                </div>

                {/* 房屋基础信息 */}
                <div className="housedetail-info">
                    <h3 className="housedetail-infoTitle">
                        {title}
                    </h3>
                    <Flex className="housedetail-tags">
                        <Flex.Item>
                            {this.renderTags()}
                        </Flex.Item>
                    </Flex>

                    <Flex className="housedetail-infoPrice">
                        <Flex.Item className="housedetail-infoPriceItem">
                            <div>
                                {price}
                                <span className="housedetail-month">/月</span>
                            </div>
                            <div>租金</div>
                        </Flex.Item>
                        <Flex.Item className="housedetail-infoPriceItem">
                            <div>{roomType}</div>
                            <div>房型</div>
                        </Flex.Item>
                        <Flex.Item className="housedetail-infoPriceItem">
                            <div>{size}平米</div>
                            <div>面积</div>
                        </Flex.Item>
                    </Flex>

                    <Flex className="housedetail-infoBasic" align="start">
                        <Flex.Item>
                            <div>
                                <span className="housedetail-title">装修：</span>
                                精装
                            </div>
                            <div>
                                <span className="housedetail-title">楼层：</span>
                                {floor}
                            </div>
                        </Flex.Item>
                        <Flex.Item>
                            <div>
                                <span className="housedetail-title">朝向：</span>
                                {oriented.join("、")}
                            </div>
                            <div>
                                <span className="housedetail-title">类型：</span>普通住宅
                            </div>
                        </Flex.Item>
                    </Flex>
                </div>

                {/* 地图位置 */}
                <div className="housedetail-map">
                    <div className="housedetail-mapTitle">
                        小区：
                        <span>绿谷康都</span>
                    </div>
                    <div className="housedetail-mapContainer" id="map">
                        地图
                    </div>
                </div>

                {/* 房屋配套 */}
                <div className="housedetail-about">
                    <div className="housedetail-houseTitle">房屋配套</div>
                    {
                        supporting.length === 0? (
                            <div className="title-empty">暂无数据</div>
                            ) : (
                                <HousePackage list={supporting}/>
                                )
                    }
                </div>

                {/* 房屋概况 */}
                <div className="housedetail-set">
                    <div className="housedetail-houseTitle">房源概况</div>
                    <div>
                        <div className="housedetail-contact">
                            <div className="housedetail-user">
                                <img src={BASE_URL + "/img/avatar.png"} alt="头像" />
                                <div className="housedetail-useInfo">
                                    <div>王女士</div>
                                    <div className="housedetail-userAuth">
                                        <i className="iconfont icon-auth" />
                                        已认证房主
                                    </div>
                                </div>
                            </div>
                            <span className="housedetail-userMsg">发消息</span>
                        </div>

                        <div className="housedetail-descText">
                             {description || '暂无房屋描述'}
                        </div>
                    </div>
                </div>

                {/* 推荐 */}
                <div className="housedetail-recommend">
                    <div className="housedetail-houseTitle">猜你喜欢</div>
                    <div className="housedetail-items">
                        {recommendHouses.map((item) => (
                            <HouseItem {...item} key={item.id} />
                        ))}
                    </div>
                </div>

                {/* 底部收藏按钮 */}
                <Flex className="housedetail-fixedBottom">
                    <Flex.Item onClick={this.handleFavorite}>
                        <img
                            src={BASE_URL + (isFavorite? "/img/star.png" : "/img/unstar.png")}
                            className="housedetail-favoriteImg"
                            alt="收藏"
                        />
                        <span className="housedetail-favorite">
                            {isFavorite? "已收藏" : "收藏"}
                        </span>
                    </Flex.Item>
                    <Flex.Item>在线咨询</Flex.Item>
                    <Flex.Item>
                        <a href="tel:400-618-4000" className="housedetail-telephone">
                            电话预约
                        </a>
                    </Flex.Item>
                </Flex>


            </div>
        )
    }
}