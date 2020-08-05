import React, {useEffect, useState} from 'react';
import './App.css';
import {pluralsightPath, pluralsightURL} from "./request/request";
import {Spin} from "antd";

function App() {

    const [isAuthority, setAuthority] = useState(false);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch(pluralsightURL + pluralsightPath.loginCheck).then(() => {
            setAuthority(true);
        }).catch(() => {
            setAuthority(false);
        }).finally(() => {
            setLoading(false);
        })

    });

    return (
        <Spin size="large" spinning={true}>
            <div className="App">

            </div>
        </Spin>
    );
}

export default App;
