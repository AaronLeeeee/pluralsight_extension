// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

let baseURL = "http://www.wdtechnology.club:10000/";

let functionKeyMap = {
    onSummaryDataSend,
    onIntroDataNeedRequest,
    onPopupNeedShow,
    onPopupNeedHide
};

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (functionKeyMap[request.key]) {
            functionKeyMap[request.key](request, sender, sendResponse);
        }
    });

function onPopupNeedShow(_, {tab: {id}}) {
    chrome.pageAction.setPopup({
        tabId: id,
        popup: "/index.html"
    });
    chrome.pageAction.show(id);
}

function onPopupNeedHide(_, {tab: {id}}) {
    chrome.pageAction.hide(id);
}

async function onSummaryDataSend(request) {
    await fetch(baseURL + "question", {
        body: JSON.stringify({
            questionType: request.title,
            questionRequests: request.data
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: "POST"
    });

    console.log("发送成功")
}

async function onIntroDataNeedRequest({ question, type }, sender, sendResponse) {
    sendResponse(await fetch(baseURL + "question/answer", {
        body: JSON.stringify({
            type,
            question
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: "POST"
    }).then(response => response.json()));
}