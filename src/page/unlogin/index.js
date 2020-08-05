import React from 'react';
import {Alert} from "antd";

export default function Unlogin() {
    return (
        <Alert
            message="错误"
            description="您尚未登录，无法获取对应数据"
            type="error"
        />
    );
}
