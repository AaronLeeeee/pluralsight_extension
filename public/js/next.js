setInterval(() => {
    let listTry = $('._3vlDUtmf button');
    if (listTry.length !== 0) {
        if (listTry.children('span').text() === 'Try again') {
            listTry[0].click();
        }
    }

    let list = $('.player-modal-overlay.is-active > div > div > button');
    if (list.length === 0) {
        console.log('length zero.');
        return;
    }

    if (list[0].innerHTML.toString().indexOf('Continue to next module') !== -1) {
        list[0].click();
    } else if (list[0].innerHTML.toString().indexOf('View related courses') !== -1) {
        goNextCourse().then(() => {
        });
    }


}, 3000);

async function goNextCourse() {
    try {
        const {recommendedCourses} = await fetch("/learner/user/courses/recommended", {
            method: "GET"
        }).then(response => response.json());

        const {playerUrl} = recommendedCourses[0];

        window.location.href = playerUrl
    } catch (e) {
    }
}
