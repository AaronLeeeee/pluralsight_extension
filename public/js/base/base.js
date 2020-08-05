chrome.extension.sendRequest({key: "onPopupNeedShow"});
chrome.extension.onRequest.addListener(function ({input, init}, sender, sendResponse) {
    fetch(input, init).then(success => sendResponse({success})).catch(error => sendResponse({error}))
});