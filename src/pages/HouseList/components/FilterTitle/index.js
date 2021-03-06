import React from 'react';
import { Flex } from 'antd-mobile';
import './index.css'

const titleList = [
    {title: '区域', type: 'area'},
    {title: '方式', type: 'mode'},
    {title: '租金', type: 'price'},
    {title: '筛选', type: 'more'},
];

export default function FilterTitle({titleSelectedStatus, onClick}) {
    return (
        <Flex className="filterTitle-root">
            {titleList.map(item => {
                const isSelected = titleSelectedStatus[item.type]
                return (
                    <Flex.Item key={item.type} onClick={() => onClick(item.type)}>
                        <span className={["dropdowm", isSelected ? "selected" : ""].join(" ")}>
                            <span>{item.title}</span>
                            <i className="iconfont icon-arrow"></i>
                        </span>
                    </Flex.Item>
                )
            })}
        </Flex>
    )
}
