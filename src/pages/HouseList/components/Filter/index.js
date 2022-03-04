import React, { Compoment } from 'react'
import FilterTitle from '../FilterTitle';
import FilterPicker from '../FilterPicker';
import FilterMore from '../FilterMore';
import { API } from '../../../../utils/api';

import './index.css'

// 标题高亮状态
const titleSelectedStatus =  {
    area: false,
    mode: false,
    price: false,
    more: false,
};

// FilterPicker 和 FilterMore 组件选中值
const selectedValues = {
    area: ["area", "null"],
    mode: ["null"],
    price: ["null"],
    more: [],
}

export default class Filter extends React.Component {
    state = {
        titleSelectedStatus,
        // 控制FilterPicker或FilterMore组件展示和隐藏
        openType: "",
        // 所有筛选条件数据
        filtersData: {},
        // 筛选条件的选中值
        selectedValues,
    };

    componentDidMount() {
        // 获取body
        this.htmlBody = document.body;
        this.getFiltersData()
    };

    // 点击标题菜单实现高亮
    onTitleClick = (type) => {
        // 给body加样式
        this.htmlBody.className = "body-fixed";
        const {titleSelectedStatus, selectedValues} = this.state;
        // 创建新的标题选中状态对象
        const newTitleSelectedStatus = { ...titleSelectedStatus };
        // 遍历标题选中状态对象
        Object.keys(newTitleSelectedStatus).forEach(key => {
            if (key === type) {
                // 当前标题
                newTitleSelectedStatus[type] = true;
                return;
            }
            // 其他标题
            const selectedVal = selectedValues[key];
            if (key === 'area' && (selectedVal.length !==2 || selectedVal[0] !== 'area')) {
                newTitleSelectedStatus[key] = true;
            }else if (key === 'mode' && selectedVal[0] !== 'null') {
                newTitleSelectedStatus[key] = true;
            }else if (key === 'price' && selectedVal[0] !== 'null') {
                newTitleSelectedStatus[key] = true;
            }else if (key === 'more' && selectedVal.length !== 0) {
                newTitleSelectedStatus[key] = true;
            }else {
                newTitleSelectedStatus[key] = false;
            }
        });

        this.setState({
            openType: type,
            // 使用新标题选中状态更新
            titleSelectedStatus: newTitleSelectedStatus,
        })
        // this.setState(prevState => {
        //     return {
        //         titleSelectedStatus: {
        //             ...prevState.titleSelectedStatus,
        //             [type]: true,
        //         },
        //         // 展示对话框
        //         openType: type,
        //     }
        // })
    };

    //取消隐藏对话框
    onCancel = (type) => {
        this.htmlBody.className = "";
        const { titleSelectedStatus, selectedValues } = this.state;
        // 创建新的标题选中状态对象
        const newTitleSelectedStatus = { ...titleSelectedStatus };
        // 其他标题
        const selectedVal = selectedValues[type];
        if (type === 'area' && (selectedVal.length !==2 || selectedVal[0] !== 'area')) {
            newTitleSelectedStatus[type] = true;
        }else if (type === 'mode' && selectedVal[0] !== 'null') {
            newTitleSelectedStatus[type] = true;
        }else if (type === 'price' && selectedVal[0] !== 'null') {
            newTitleSelectedStatus[type] = true;
        }else if (type === 'more' && selectedVal.length !== 0) {
            newTitleSelectedStatus[type] = true;
        }else {
            newTitleSelectedStatus[type] = false;
        }
        this.setState({
            openType: "",
            // 使用新标题选中状态更新
            titleSelectedStatus: newTitleSelectedStatus,
        })
    };

    //确定（隐藏对话框）
    onSave = (type, value) => {
        const { titleSelectedStatus } = this.state;
        // 创建新的标题选中状态对象
        const newTitleSelectedStatus = { ...titleSelectedStatus };
        // 其他标题
        const selectedVal = value;
        if (type === 'area' && (selectedVal.length !==2 || selectedVal[0] !== 'area')) {
            newTitleSelectedStatus[type] = true;
        }else if (type === 'mode' && selectedVal[0] !== 'null') {
            newTitleSelectedStatus[type] = true;
        }else if (type === 'price' && selectedVal[0] !== 'null') {
            newTitleSelectedStatus[type] = true;
        }else if (type === 'more' && selectedVal.length !== 0) {
            newTitleSelectedStatus[type] = true;
        }else {
            newTitleSelectedStatus[type] = false;
        }

        const newSelectedValues =  {
            ...this.state.selectedValues,
            [type]: value,
        };
        // 筛选条件数据
        const filters = {};
        const { area, mode, price, more } = newSelectedValues;
        // 区域
        const areaKey = area[0];
        let areaValue = "null";
        if ( area.length === 3 ) {
            areaValue = area[2] !== "null" ?  area[2] : area[1];
        }
        filters[areaKey] = areaValue;

        // 方式和组件
        filters.rentType = mode[0];
        const money = price[0].split('|')
        filters.price = money[1];
        // 更多筛选条件more
        filters.more = more.join(",");
        // 调用父组件中方法，将筛选数据传递给父组件
        this.props.onFilter(filters)


        this.setState({
            openType: "",
            // 使用新标题选中状态更新
            titleSelectedStatus: newTitleSelectedStatus,
            selectedValues: newSelectedValues,
        })
    };

    // 封装获取所有筛选条件的方法
    async getFiltersData() {
        // 获取当前城市定位
        const { value } = JSON.parse(localStorage.getItem('zf_city'));
        const res = await API.get(`/houses/condition?id=${value}`);
        this.setState({
            filtersData: res.data.body,
        })
    };

    // 渲染FilterPicker组件的方法
    renderFilterPicker() {
        const { openType, filtersData:{area, subway, rentType, price}, selectedValues } = this.state;
        if (openType !== "area" && openType !== "mode" && openType !== "price"){
            return null;
        }
        // 根据openType 来拿到当前筛选条件的数据
        let data = [];
        let cols = 3;
        let defaultValue = selectedValues[openType]
        switch (openType) {
            case "area":
                data = [area, subway];
                cols = 3;
                break;
            case "mode":
                data = rentType;
                cols = 1;
                break;
            case "price":
                data = price;
                cols = 1;
                break;
            default:
                break;
        }
        return (
            <FilterPicker
                key={openType} //react设定只要key不一样就会重新创建（解决了不关闭就不创建的问题）
                onCancel={this.onCancel}
                onSave={this.onSave}
                data={data}
                cols={cols}
                type={openType}
                defaultValue={defaultValue}
            />)
    };

    // 渲染Filtermore组件
    renderFilterMore() {
        const { openType,
            selectedValues,
            filtersData:{roomType, oriented, floor, characteristic} } = this.state;
        const defaultValue = selectedValues.more;
        if (openType !== "more") {
            return null
        }
        const data = {
            roomType,
            oriented,
            floor,
            characteristic,
        };
        return <FilterMore data={data} type={openType} onSave={this.onSave} defaultValue={defaultValue} onCancel={this.onCancel}/>;
    }

    render() {
        const { titleSelectedStatus, openType } = this.state;
        return (
            <div className="filter-root">
                {/*   前三个菜单的遮罩层 */}
                {openType === "area" || openType === "mode" || openType === "price" ? (
                    <div className="filter-mask" onClick={() => this.onCancel(openType)}></div>
                ) : null}

                <div className="filter-content">
                    {/*    标题栏*/}
                    <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick}/>

                    {/*    前三个菜单对应内容*/}
                    {this.renderFilterPicker()}

                    {/*    最后一个菜单内容*/}
                    {this.renderFilterMore()}
                </div>
            </div>
        )
    }
}