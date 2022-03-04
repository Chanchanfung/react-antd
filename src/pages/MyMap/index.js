import React from 'react';
// import axios from "axios";
import { API } from '../../utils/api'
import  NavHeader from'../../components/NavHeader'
import { Link } from "react-router-dom";
import {Toast} from "antd-mobile";
import './index.css'
import index from "../../components/NavHeader";
import {BASE_URL} from '../../utils/url'
import HouseItem from "../../components/HouseItem";


// 导入百度地图组件
// import {Map, NavigationControl} from 'react-bmapgl';

// 解决脚手架中全局变量访问问题
const BMap = window.BMap
export default class MyMap extends React.Component {
    state = {
        houseList: [],
        // 是否展现房源列表
        isShowList: false,
    };

    componentDidMount() {
        this.initMap()
    }
    
    initMap() {
        // 获取当前定位城市
        const {label, value} = JSON.parse(localStorage.getItem('zf_city'))
        // 初始化地图实例
        const map = new BMap.Map("container");  // react脚手架中全局对象需要通过window来访问，否则ESLint校验错误
        // 设置中心点坐标
        // const point = new BMap.Point(116.404, 39.915);
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    // 初始化地图实例
                    map.centerAndZoom(point, 11);
                    // map.addOverlay(new BMap.Marker(point));
                    // 把map暴露出去让下面可以通过this获取
                    this.map = map;

                    // 添加控件
                    map.addControl(new BMap.NavigationControl());
                    map.addControl(new BMap.ScaleControl());

                    this.renderOverlays(value)

                    // 获取房源数据
                    // const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
                    // res.data.body.forEach((item) => {
                    //     const {coord: {longitude, latitude}, label:areaName, count, value} = item;
                    //
                    //     const areaPoint = new BMap.Point(longitude, latitude);
                    //
                    //     const opts = {
                    //         position: areaPoint,
                    //         offset: new BMap.Size(-35, -35)
                    //     };
                    //     // 创建Label实例对象
                    //     const label =new BMap.Label("", opts);
                    //
                    //     // 给label对象添加唯一标识
                    //     label.id = value;
                    //     // 设置房源覆盖物
                    //     label.setContent(`
                    //      <div class="bubble">
                    //         <p class="over-name">${areaName}</p>
                    //         <p>${count}套</p>
                    //      </div>`)
                    //     // 添加单击时间
                    //     label.addEventListener("click", () => {
                    //         // 放大地图
                    //         map.centerAndZoom(areaPoint,13);
                    //         // 清除覆盖物信息
                    //         setTimeout( () => {
                    //             map.clearOverlays();
                    //         })
                    //     })
                    //     // 添加覆盖物到地图中
                    //     map.addOverlay(label);
                    //     }
                    // )
                }
            },
            label);

        // 绑定移动时间
        map.addEventListener("movestart", () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        } )
    }

    // 渲染覆盖物入口
    async renderOverlays(id) {
        try {
            // 开启loading
            Toast.loading("加载中", 0, null, false)
            const res = await API.get(`/area/map?id=${id}`)
            //关闭loading
            Toast.hide();
            const data = res.data.body;

            // 获取地图缩放级别
            const {nextzoom, type} = this.getTypeAndZoom()

            data.forEach(item => {
                // 创建覆盖物
                this.createOverlays(item, nextzoom, type);
            })
        }catch (e) {
            //关闭loading
            Toast.hide();
        }
    };

    // 计算要绘制覆盖物类型和缩放级别
    getTypeAndZoom() {
        // 调用getZoom()方法，获取缩放级别
        const zoom = this.map.getZoom();
        let nextzoom, type;
        if (zoom >= 10 && zoom <12) {
            nextzoom = 13; // 下一个缩放级别
            type = "circle";
        }else if (zoom >= 12 && zoom < 14) {
            //镇
            nextzoom = 15;
            type = "circle"
        }else if (zoom >= 14 && zoom < 16) {
            //小区
            type = "rect"
        }

        return {nextzoom, type}
    };

    // 创建覆盖物
    createOverlays(data, zoom, type){
        const {coord: {longitude, latitude}, label:areaName, count, value} = data;
        const areaPoint = new BMap.Point(longitude, latitude); //创建地图坐标
        if (type === "circle") {
            this.createCircle(areaPoint, areaName, count, value, zoom);
        }else {
            this.creatRect(areaPoint, areaName, count, value);
        }
    };

    //创建区、镇级覆盖物
    createCircle(point, name, count, id, zoom) {
            const opts = {
                position: point,
                offset: new BMap.Size(-35, -35)
            };
            // 创建Label实例对象
            const label =new BMap.Label("", opts);

            // 给label对象添加唯一标识
            label.id = id;
            // 设置房源覆盖物
            label.setContent(`
             <div class="bubble">
                <p class="over-name">${name}</p>
                <p>${count}套</p>
             </div>`)
            // 添加单击时间
            label.addEventListener("click", () => {
                // 放大地图
                this.map.centerAndZoom(point, zoom);
                // 清除覆盖物信息
                setTimeout( () => {
                    this.map.clearOverlays();
                })

                // 调用renderOverlays方法，获取该层级下的房源
                this.renderOverlays(id);
            })
            // 添加覆盖物到地图中
            this.map.addOverlay(label);
    };

    //创建小区覆盖物
    creatRect(point, name, count, id) {
        // 创建覆盖物
        const label =new BMap.Label("", {
            position: point,
            offsize: new BMap.Size(-50, -28)
        });

        // 给label添加唯一标识
        label.id = id;

        // 设置房源覆盖物
        label.setContent(`
            <div class="rect">
                <span class="housename">${name}</span>
                <span class="housenum">${count}套</span>
                <i class="arrow"></i>
            </div>>
        `)
        // 添加点击事件
        label.addEventListener("click", (e) => {
            this.getHoseList(id);
            // 获取当前被点击项
            const target = e.changedTouches[0];
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY,
            )
        })
        // 添加覆盖物到地图中
        this.map.addOverlay(label);
    };

    // 获取小区房源数据
    async getHoseList(id) {
        try {
            // 开启loading
            Toast.loading("加载中", 0, null, false)
            const res = await API.get(`/houses?cityId=${id}`)
            //关闭loading
            Toast.hide();
            this.setState({
                houseList: res.data.body.list,

                // 展示房源列表
                isShowList: true
            })
        }catch (e) {
            //关闭loading
            Toast.hide();
        }
    }

    // 渲染房屋列表方法
    renderHouseList() {
        const {houseList} = this.state;
        return (
            houseList.map((item, index) => (
                    <HouseItem
                        onClick={() => this.props.history.push(`/detail/${houseList[index].houseCode}`)}
                        key={item.houseCode}
                        src={BASE_URL+ item.houseImg}
                        title={item.title}
                        desc={item.desc}
                        tags={item.tags}
                        price={item.price}
                    />
                    // <div className="housestructure" key={item.houseCode}>
                    //     <div className="imgWrap">
                    //         <img src={BASE_URL+ item.houseImg} alt="" className="img1"/>
                    //     </div>
                    //     <div className="content1">
                    //         <h3 className="title1">{item.title}</h3>
                    //         <div className="desc">{item.desc}</div>
                    //         <div className="tagWrap">
                    //             {item.tags.map((tag, index) => (
                    //                 <span className={`tag tag${index+1} `} key={tag}>{tag}</span>
                    //             ))}
                    //         </div>
                    //         <div className="price">
                    //             <span className="priceNum">{item.price}</span>
                    //         </div>
                    //     </div>
                    // </div>
                )
            )
        )
    }

    render(){
        return <div className="map">
            {/*顶部导航组件*/}
            <NavHeader>地图找房</NavHeader>

            {/*地图容器*/}
            <div id="container"></div>

            {/*房源列表*/}
            <div className={`houseList ${this.state.isShowList ? "show" : ''}`}>
                <div className="titleWrap">
                    <h1 className="listTitle">房屋列表</h1>
                    <Link classname="moremore" to="/home/list">更多房源</Link>
                </div>

                <div className="houseitems">
                    {this.renderHouseList()}
                </div>
            </div>
        </div>
    }
}