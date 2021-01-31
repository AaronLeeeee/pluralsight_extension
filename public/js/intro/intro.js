let tracking = false;

//去掉所有的html标记
function delHtmlTag(str) {
    return str.replace(/<(?:.|\s)*?>/g, "").replace(/[\r\n ]/g, "");
}

function getNeedCheck() {
    let htmls = $(".questionDisplay__h7_A_");

    return htmls.length > 0;
}

function getQuestion() {
    return $(".stem__4BNEW")[0].innerHTML;
}

function checkNeedGetAnswer() {
    let result = ['未找到答案', '已找到答案'].reduce((previous, current) => {
        return previous && $(".stem__4BNEW")[0].innerHTML.indexOf(current) === -1;
    }, true);

    if (!result) return false;

    return !tracking;
}

function getTitle() {
    let str = window.location.href.replace("https://app.pluralsight.com/skilliq/", "");

    str = str.split("?")[0];

    return str;
}

async function getAnswer() {
    tracking = true;

    const question = getQuestion();

    console.log(question);

    let {possibleIndex, answer} = await request(getTitle(), question);

    console.log(possibleIndex, answer);

    tracking = false;

    // 找到后向对应标签中添加展示符
    markToData(answer, possibleIndex);
}

function request(type, question) {
    return new Promise((resolve, reject) => {
        chrome.extension.sendRequest({key: "onIntroDataNeedRequest", type, question}, (response) => {
            resolve(response)
        });
    });
}

function markToData(answer, possibleIndex) {
    if (possibleIndex === -1) {
        $(".stem__4BNEW").append("<p>未找到答案</p>");
        return;
    }

    const answerHtml = delHtmlTag(answer);

    let choices = $('li > button');

    let finalIndex = -1;

    for (let i = 0; i < choices.length; i++) {
        console.log(answerHtml, delHtmlTag(choices[i].innerHTML));
        if (answerHtml === delHtmlTag(choices[i].innerHTML)) {
            console.log("查找到了");
            finalIndex = i;
        }
    }

    if (finalIndex !== -1) {
        choices[finalIndex].append("Right Answer");
        $(".stem__4BNEW").append("<p>已找到答案</p>");
    } else if (possibleIndex !== -1) {
        choices[possibleIndex].append("Possible Answer");
        $(".stem__4BNEW").append("<p>已找到答案</p>");
    }
}

$(() => {
    setInterval(() => {
        console.log('执行这里了');
        if (getNeedCheck()) {
            if (checkNeedGetAnswer()) {
                getAnswer().then();
            } else {
                console.log("不需要获取数据");
            }
        }
    }, 3000);
});
