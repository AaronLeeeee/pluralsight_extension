setInterval(() => {
    let list = $('.player-modal-overlay.is-active > div > div > button');
    if (list.length === 0) return;
    list[0].click();
}, 3000);
