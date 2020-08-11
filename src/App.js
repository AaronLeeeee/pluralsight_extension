import React, {useEffect, useState} from 'react';
import './App.css';
import {PluralsightPath, onRequestPluralsight} from "./request/request";
import {Spin} from "antd";
import Unlogin from "./page/unlogin";
import Summary from "./page/summary";
import {StoreKey, storeSave} from "./store";

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
                const { email } = await onRequestPluralsight(PluralsightPath.loginCheck).then(response => response.json());

                storeSave(StoreKey.CurrentUser, email);

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
                minWidth: 500,
                minHeight: 300,
            }}>
                {page}
            </div>
        </Spin>
    );
}

export default App;
