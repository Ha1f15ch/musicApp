document.addEventListener('DOMContentLoaded', () => {
    var btn_aditPlaylist = document.querySelector('.btn_aditPlaylist')
    btn_aditPlaylist.addEventListener('click', () => {
        let block_editedPlaylist = document.querySelector('.block_editedPlaylist')
        if(block_editedPlaylist.classList.contains('hidden')) {
            block_editedPlaylist.classList.remove('hidden')
        } else {
            block_editedPlaylist.classList.add('hidden')
        }
    })

    var btn_editPlaylist = document.querySelector('.btn_editPlaylist')
    btn_editPlaylist.addEventListener('click', async () => {
        let new_nameData = document.querySelector('.name_playlist').value

        var href = document.location.href
        try {

            var res = await fetch(href, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "name": new_nameData
                })
            })
            if(res.ok) {
                window.location = href
            } else {
                alert(`Такая запись ${new_nameData} уже есть, попробуйте выбрать другое значение. . .`)
                setTimeout(window.location = preload, 2000)
            }
        } catch(e) {
            console.log('ошибка', e)

        }
    })

    var btn_deletePlaylist = document.querySelector('.btn_deletePlaylist')
    btn_deletePlaylist.addEventListener('click', () => {
        let blockDeletePlaylist = document.querySelector('.blockDeletePlaylist')
        if(blockDeletePlaylist.classList.contains('hidden')) {
            blockDeletePlaylist.classList.remove('hidden')
        } else {
            blockDeletePlaylist.classList.add('hidden')
        }

        var disbleDelete = document.querySelector('.disbleDelete')
        disbleDelete.addEventListener('click', () => {
            blockDeletePlaylist.classList.add('hidden')
        })
    })

    var approveDelete = document.querySelector('.approveDelete')
    approveDelete.addEventListener('click', async () => {
        fetch(document.location.href, {
            method: 'DELETE'
        })
        .then(function(data) {
            window.location = 'http://localhost:3000/v1/api/adminCatalog/myPlaylists'
        })
        .catch(function(data) {
            console.log('Ошбика - ', data)
            alert('Ошибка при удалении')
            window.location = window.location.href
        })
    })
})