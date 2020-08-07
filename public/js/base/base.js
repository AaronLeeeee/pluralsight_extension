chrome.extension.sendRequest({key: "onPopupNeedShow"});
chrome.extension.onRequest.addListener(function ({input, init}, sender, sendResponse) {
    fetch(input, init).then(response => response.json()).then(success => sendResponse({success})).catch(error => sendResponse({error}))
});
