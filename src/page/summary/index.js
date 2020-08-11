import React, {useEffect, useState} from 'react';
import "./summary.css"
import {Table, Tag, Spin, Button, Space} from 'antd';
import {onRequestPluralsight, PluralsightPath} from "../../request/request";
import {storeGet, StoreKey} from "../../store";
import Action from "../action";

const columns = [
    {
        title: "名称",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "上传状态",
        dataIndex: "done",
        key: "done",
        render: (text, {done}, index) => {
            console.log(done);

            return (<Tag color={done ? 'green' : 'volcano'} key={index}>
                {done ? '已上传' : '未上传'}
            </Tag>);
        }
    },
    {
        title: "上传时间",
        dataIndex: "uploadDate",
        key: "uploadDate"
    }
];

function Summary() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [isAction, setIsAction] = useState(false);

    useEffect(() => {
        const request = async () => {
            const currentUser = storeGet(StoreKey.CurrentUser);

            console.log(currentUser);

            const response = await onRequestPluralsight(`${PluralsightPath.skillMeasurements}${currentUser}`).then(response => response.json());

            const localSave = storeGet(currentUser) || {};

            const finalData = response.map((item) => {
                const {url, dateCompleted} = item;
                // 没做过的题或者已经有的题，不加入
                const {date, uploadDate} = localSave[url] || {};

                let done = date !== null && date === dateCompleted;

                return {
                    ...item,
                    done,
                    uploadDate,
                };
            });

            setLoading(false);

            setData(finalData);
        };
        request().then();
    }, []);

    return isAction ? <Action data={data}/> : (
        <Spin size="large" spinning={loading}>
            <div style={{
                paddingTop: 16,
                paddingLeft: 8,
                paddingRight: 8
            }}>
                <Button style={{
                    width: 100
                }} type="primary" onClick={() => setIsAction(true)}>
                    上传
                </Button>

                <Table className="background" columns={columns} dataSource={data} rowKey={({id}) => id}/>
            </div>
        </Spin>
    );
}

export default Summary;
