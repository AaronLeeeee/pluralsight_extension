import React, {useEffect, useState} from "react";
import {Progress, Space, Timeline} from "antd";
import {storeGet, StoreKey, storeSave} from "../../store";
import {BackendPath, onRequestBackend, onRequestPluralsight, PluralsightPath} from "../../request/request";

function formatNow() {
    const date = new Date();

    const year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    return year + '-' +
        (month < 10 ? '0' + month : month) + '-' +
        (day < 10 ? '0' + day : day) + ' ' +
        (hour < 10 ? '0' + hour : hour) + ':' +
        (min < 10 ? '0' + min : min) + ':' +
        (sec < 10 ? '0' + sec : sec);
}

export default function Action(props) {
    const {data} = props;

    const [percent, setPercent] = useState(0.0);
    const [doneJobs, setDoneJobs] = useState([]);
    const [waitingJob, setWaitingJob] = useState(null);

    useEffect(() => {
        const uploading = async () => {
            const finalUploadData = data.filter(item => !item.done);

            const userId = storeGet(StoreKey.CurrentUser);
            let userDone = storeGet(userId) || {};
            let alreadyDoneJob = [];

            const eachPercent = 100.0 / finalUploadData.length;

            for (let i = 0; i < finalUploadData.length; i++) {
                const {title, url, dateCompleted} = finalUploadData[i];
                setWaitingJob("准备获取" + title + "习题总数据");

                const startPercent = eachPercent * i;

                try {
                    await (new Promise(resolve => setTimeout(() => resolve(), 500)));
                    // 获取 总习题数据
                    const {data: {dataLength}} = await onRequestPluralsight(PluralsightPath.skill + url + "/summary-review/data");

                    let items = [];

                    const eachLoopPercent = eachPercent / dataLength;

                    for (let j = 1; j < dataLength; j++) {
                        setWaitingJob(`${title} 习题总数据获取完成，共${dataLength}道题。开始获取第${j}题数据`);

                        const {data: {assessment_item_id: questionId, answer_index: answerIndex, stem: question, stem_image_url: questionImageUrl, choices}} = await onRequestPluralsight(`${PluralsightPath.skill}${url}/summary-review/data/questions/${j}`);

                        items.push({
                            questionId,
                            answerIndex,
                            question,
                            questionImageUrl,
                            choices
                        });
                        // 设置当前进度
                        setPercent(startPercent + eachLoopPercent * (j - 1));
                    }

                    await onRequestBackend(BackendPath.question, {
                        body: JSON.stringify({
                            questionType: url,
                            questionRequests: items
                        }),
                        headers: {
                            'content-type': 'application/json'
                        },
                        method: "POST"
                    });

                    alreadyDoneJob.push({
                        name: `${title} 习题上传成功，共${dataLength}道题。`,
                        success: true,
                        key: i
                    });
                    // 设置已完成时间轴
                    setDoneJobs(alreadyDoneJob);
                    // 保存已完成数据
                    userDone[url] = {
                        date: dateCompleted,
                        uploadDate: formatNow()
                    };
                    storeSave(userId, userDone);
                } catch (e) {
                    console.log(e);
                    alreadyDoneJob.push({
                        name: `${title} 习题上传失败`,
                        success: false,
                        key: i
                    });
                }
                setDoneJobs(alreadyDoneJob);
            }
            setWaitingJob(null);
        };
        uploading().then();
    }, [data]);

    return (
        <div>
            <div style={{
                textAlign: "center",
                marginBottom: 16
            }}>
                <Progress type="dashboard" percent={percent.toFixed(2)}/>
            </div>
            <Timeline pending={waitingJob} reverse>
                {doneJobs.map(item => (
                    <Timeline.Item key={item.key}
                                   color={item.success ? 'green' : 'red'}>
                        {item.name}
                    </Timeline.Item>))}
            </Timeline>
        </div>
    );
}
