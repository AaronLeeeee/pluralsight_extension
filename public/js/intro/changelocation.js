let location_url = window.location.href;

let re = /score\/skill-assessment\/[a-z|A-Z|-]*\?/;

if (location_url.match(re)) {
    location_url = location_url.replace('score/skill-assessment', 'skilliq');

    window.location.href = location_url;
}
