import React, {Component} from 'react';
import FilterFooter from '../../../../components/FilterFooter';
import './index.css'

export default class FilterMore extends React.Component {
    state= {
        selectedValues: this.props.defaultValue,
    };

    onTagClick(value) {
        const { selectedValues } = this.state;
        const newSelectdeValues = [...selectedValues];
        if (newSelectdeValues.indexOf(value) === -1) {
            // 没有当前值
            newSelectdeValues.push(value);
        }else {
            // 有
            const index = newSelectdeValues.findIndex((item) => item === value);
            newSelectdeValues.splice(index, 1)
        }
        this.setState({
            selectedValues: newSelectdeValues,
        })
    };

    // 取消按钮事件处理函数
    onCancel = () => {
      this.setState({
          selectedValues: [],
      })
    };

    // 确定按钮事件处理函数
    onOk = () => {
        const {type, onSave} = this.props;
        // 这是父组件中的方法
        onSave(type, this.state.selectedValues);
    }

    // 渲染标签
    renderFilters(data) {
        const { selectedValues } = this.state;
        return data.map((item) => {
            const isSelected = selectedValues.indexOf(item.value) !== -1;
            return (
                <span
                    key={item.value}
                    className={["filterMore-tag", isSelected? "filterMore-tagActive" : ""].join(" ")}
                    onClick={() => {this.onTagClick(item.value)}}
                >
                    {item.label}
                </span>
            )
        })
    }
    render() {
        const {data : {roomType, oriented, floor, characteristic}, onCancel, type } = this.props;
        return (
            <div className="filterMore-root">
            {/*    遮罩层*/}
                <div className="filterMore-mask" onClick={() => onCancel(type)}></div>

            {/*    条件内容*/}
                <div className="filterMore-tags">
                    <dl className="filterMore-dl">
                        <dt className="filterMore-dt">户型</dt>
                        <dd className="filterMore-dd">{this.renderFilters(roomType)}</dd>

                        <dt className="filterMore-dt">朝向</dt>
                        <dd className="filterMore-dd">{this.renderFilters(oriented)}</dd>

                        <dt className="filterMore-dt">楼层</dt>
                        <dd className="filterMore-dd">{this.renderFilters(floor)}</dd>

                        <dt className="filterMore-dt">房屋点亮</dt>
                        <dd className="filterMore-dd">{this.renderFilters(characteristic)}</dd>
                    </dl>
                </div>

            {/*    底部按钮*/}
                <FilterFooter
                    className="filterFooter-footer"
                    cancelText="清除"
                    okText="确定"
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                />
            </div>
        )
    }
}