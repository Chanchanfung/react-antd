import React from 'react';
import PropTypes from "prop-types";
import "./index.css";
import {BASE_URL} from "../../utils/url";

const NoHouse = ({children}) => (
    <div className="nohouse-root">
        <img
            className="nohouse-img"
            src={BASE_URL + "/img/not-found.png"}
            alt="暂无数据"
        />
        <p className="nohouse-msg">{children}</p>
    </div>
)

NoHouse.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NoHouse;