let location_url = window.location.href;
console.log(location_url);

if (location_url.indexOf('/intro') === -1) {
    location_url = location_url.replace('score/skill-assessment', 'skilliq');

    window.location.href = location_url;
}
