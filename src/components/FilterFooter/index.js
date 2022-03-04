import React from 'react';
import { Flex } from "antd-mobile";
import ProTypes from 'prop-types';
import './index.css';

function FilterFooter({
    cancelText,
    okText ,
    onCancel,
    onOk,
    className,}) {
    return (
        <Flex className={["filterFooter-root", className || ""].join(" ")}>
        {/*    取消按钮*/}
            <span className={["filterFooter-btn", "FilterFooter-cancel"].join(" ")} onClick={onCancel}>
                {cancelText}
            </span>

        {/*    确定按钮*/}
            <span className={["filterFooter-btn", "FilterFooter-ok"].join(" ")} onClick={onOk}>
                {okText}
            </span>
        </Flex>
    )
}

// props校验
FilterFooter.proTypes = {
    cancelText: ProTypes.string,
    okText: ProTypes.string,
    onCancel: ProTypes.func,
    onOk: ProTypes.func,
    className: ProTypes.string,
}

export default FilterFooter
