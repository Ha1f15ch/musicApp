document.addEventListener('DOMContentLoaded', () => {
    var btn_addPlaylist = document.querySelector('.addPlaylist')
    btn_addPlaylist.addEventListener('click', async () => {
        var block_newplaylist = document.querySelector('.block_newplaylist')
        if(block_newplaylist.classList.contains('hidden')) {
            block_newplaylist.classList.remove('hidden')
        } else {
            block_newplaylist.classList.add('hidden')
        }
    })

    var btn_valPlaylist_admin_getPlaylist = document.querySelector('.btn_valPlaylist_admin_getPlaylist')
    btn_valPlaylist_admin_getPlaylist.addEventListener('click', async () => {
        window.location = "https://mytestferssite.ru"+btn_valPlaylist_admin_getPlaylist.getAttribute('btn_admin_getPlaylist')
    })

    var btn_createNewPlaylist = document.querySelector('.btn_createNewPlaylist')
    btn_createNewPlaylist.addEventListener('click', async () => {
        let nameData = document.querySelector('.name_playlist').value

        const href = document.location.href
        var res = await fetch(href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "name": nameData
            })
        })
        if(res.ok) {
            window.location = href
        } else {
            window.location = href
            setTimeout(alert('Возникла ошибка при создании нового плэйлиста, указано используемое название - ', nameData), 2000)
        }
    })
})