import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

function HouseItem ({src, title, desc, tags, price, onClick, style}) {
    return (
        <div className="housestructure" onClick={onClick} style={style}>
            <div className="imgWrap">
                <img src={src} alt="" className="img1"/>
            </div>
            <div className="content1">
                <h3 className="title1">{title}</h3>
                <div className="desc">{desc}</div>
                <div className="tagWrap">
                    {tags.map((tag, index) => (
                        <span className={`tag tag${index+1} `} key={tag}>{tag}</span>
                    ))}
                </div>
                <div className="price">
                    <span className="priceNum">{price}</span>
                </div>
            </div>
        </div>
    )
}

HouseItem.propsTypes = {
    scr: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    tags: PropTypes.array.isRequired,
    price: PropTypes.number,
    onClick: PropTypes.func,
}

export default HouseItem;