setInterval(3000, () => {
    let location_url = window.location.href;

    if (location_url.indexOf('/intro') === -1) {
        location_url = location_url.replace('score/skill-assessment', 'skilliq');

        window.location.href = location_url;
    }
});
