import React, { useState } from 'react';
import './index.scss'; // 请根据你的项目目录结构和样式文件路径修改导入路径

const Vinyl = () => {
    const [isRotating, setIsRotating] = useState(true);

    const toggleRotation = () => {
        setIsRotating(!isRotating);
    };
    return (
        <div className={`vinyl-record ${isRotating ? 'rotate' : ''}`} onClick={toggleRotation}>
            <div className="center-hole"></div>
            <div className="grooves">
                <div className="groove"></div>
                <div className="groove"></div>
            </div>
        </div>
    );
};

export default Vinyl;
