import React, {useEffect, useState} from 'react';
import './App.css';
import {PluralsightPath, PluralsightURL, onRequest} from "./request/request";
import {Button, Spin} from "antd";
import Unlogin from "./page/unlogin";
import Summary from "./page/summary";
import axios from "axios";

const AppType = {
    Loading: 0,
    HasLogin: 1,
    NotLogin: 2
};

function App() {
    const [appType, setAppType] = useState(0);

    useEffect(() => {
        const checkLogin = async () => {
            let data;
            try {
                await onRequest(PluralsightPath.loginCheck);
                data = AppType.HasLogin;
            } catch (_) {
                data = AppType.NotLogin;
            }
            setAppType(data);
        };
        checkLogin().then();
    }, []);

    let page = (<div/>);

    if (appType !== AppType.Loading) {
        page = appType === AppType.HasLogin ? (<Summary/>) : (<Unlogin/>);
    }

    return (
        <Spin size="large" spinning={appType === AppType.Loading}>
            <div style={{
                width: 500,
                height: 300,
            }}>
                {page}
            </div>
        </Spin>
    );
}

export default App;
