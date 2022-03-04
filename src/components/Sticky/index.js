import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types'
import './index.css';

class Sticky extends React.Component{
    // 创建ref对象
    placeholder = createRef();
    content = createRef();

    // 监听scroll事件
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll)
    }

    // scroll事件的处理函数
    handleScroll= () => {
        const {height} = this.props;
       // 获取ref对应的Dom对象
        const placeholderEl = this.placeholder.current;
        const contentEl = this.content.current;
        const {top} = placeholderEl.getBoundingClientRect();
        if (top < 0) {
            // 吸顶
            placeholderEl.style.height = `${height}px`;
            contentEl.classList.add("fixed")
        }else {
            placeholderEl.style.height = "0px";
            contentEl.classList.remove("fixed")
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    }

    render() {
        return (
            <div>
                {/*    占位元素*/}
                <div ref={this.placeholder} />
                {/*    内容元素*/}
                <div ref={this.content}>{this.props.children}</div>
            </div>
        )
    }
}

Sticky.propsType = {
    height: PropTypes.number.isRequired,
};

export default Sticky;