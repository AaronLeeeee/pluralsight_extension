export const PluralsightPath = {
    loginCheck: "/web-analytics/api/v1/users/current",
    roleIq: "/roleiq/api/roles",
    questions: "/data/questions/",
    skill: "/score/skill-assessment/",
    skillMeasurements: "/profile/data/skillmeasurements/",
};

export const BackendPath = {
    question: "question"
};

export function onRequestPluralsight(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {input, init}, ({success, error}) => {
                if (success) {
                    resolve(success);
                } else {
                    reject(error);
                }
            });
        });
    });
}

export function onRequestBackend(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const bg = chrome.extension.getBackgroundPage();

    return bg.requestData(input, init);
}
