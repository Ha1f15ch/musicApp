document.addEventListener('DOMContentLoaded', () => {
    const playlist = document.querySelector('.playlist')
    const player = document.querySelector('.player')
    const name_song = document.querySelector('.name_song')
    const audio_player = document.querySelector('.audio_player')
    const play_player = document.querySelector('.play_player')
    const prev_player = document.querySelector('.prev_player_img')
    const next_player = document.querySelector('.next_player_img')
    const progress_container_player = document.querySelector('.progress_container_player')
    const progress_player = document.querySelector('.progress_player')
    const volume_player = document.querySelector('.volume_player')
    const change_size__volume = document.querySelector('.change_size__volume')
    const size_volume = document.querySelector('.size_volume')
    
    var btn_aditPlaylist = document.querySelector('.btn_aditPlaylist')
    var musArray = []
    var PrevElement = document.querySelectorAll('.song_item')
    var btn_delete_icon = document.querySelectorAll('.btn_delete_icon')

    for(let k = 0; k < btn_delete_icon.length; k++) {
        btn_delete_icon[k].addEventListener('click', async () => {
            console.log('Данные из выборки - ', btn_delete_icon[k])

            var positionInMass = btn_delete_icon[k].getAttribute('arraydata')
            var parentIMG = btn_delete_icon[k].parentNode //div в который обернуто изображение-кнопка
            var parent_musItem = parentIMG.parentNode //div, в котром содержатся кнопки и ссылка на композицию
    
            var prev_href = document.location.href
            var href = document.location.href+'/deletemusic'
            try {

                var res = await fetch(href, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        "positionValue": positionInMass
                    })
                })
                if(res.ok) {
                    href = prev_href
                    console.log('Успешно!')
                    setTimeout(() => {
                        playlist.removeChild(parent_musItem)
                        setArrayId(parseInt(positionInMass))
                        alert('Удалено')
                    }, 1500);
                } else {
                    console.log('Не получилось')

                }
            } catch(e) {
                console.log('Что-то пошло не так - ', e)
            }
        })
    }

    function setArrayId(deletedElement) {
        let massElemnts = document.querySelectorAll('.btn_delete_icon')
        for(let i = 0; i < massElemnts.length; i++) {
            if(parseInt(massElemnts[i].getAttribute('arraydata')) > deletedElement) {
                let tempValue = parseInt(massElemnts[i].getAttribute('arraydata'))
                tempValue -= 1
                massElemnts[i].setAttribute('arraydata', tempValue)
            }
        }
    }
    
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

        var href_prev = document.location.href
        var href = document.location.href+'/updateName'
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
                window.location = href_prev
            } else {
                alert(`Такая запись ${new_nameData} уже есть, попробуйте выбрать другое значение. . .`)
                setTimeout(window.location = href_prev, 2000)
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
            window.location = 'http://localhost:3000/v1/api/adminCatalog/playlists'
        })
        .catch(function(data) {
            console.log('Ошбика - ', data)
            alert('Ошибка при удалении')
            window.location = window.location.href
        })
    })

    for(let i = 0; i < PrevElement.length; i++) {
        let tempValDataSongItem = PrevElement[i].querySelector('.button_play')
        let DataSRCSong = tempValDataSongItem.getAttribute('href')
        musArray.push(DataSRCSong)
    }

    function progressBar(e) {
        const {duration, currentTime} = e.srcElement
        const progressPercent = (currentTime / duration) * 100
        progress_player.style.width = `${progressPercent}%`
    }

    function setProgressInProgressBar(e) {
        const width = this.clientWidth
        const clickPositionX = e.offsetX
        const duration = audio_player.duration

        audio_player.currentTime = (clickPositionX / width) * duration
    }

    function deleteClass(classValue) {
        classValue.querySelector('.button_play').classList.remove('playing_track')
    }

    function addClass(classValue) {
        if(classValue.querySelector('.button_play').getAttribute('href') == (`/music/${audio_player.src.split('/')[4]}`)) {
            classValue.querySelector('.button_play').classList.add('playing_track')
            audio_player.classList.add('playing')
            return true
        }
    }

    function nextSong() {
        audio_player.pause()
        for(let i = 0; i < musArray.length; i++) {
            if(musArray[i] == (`/music/${audio_player.src.split('/')[4]}`)) { //определяется текущий элемент
                let nextSong = musArray[i+1]
                if(nextSong == undefined) {
                    audio_player.src = musArray[musArray.length - 1]
                    for (let j = 0; j < PrevElement.length; j++) {
                        if(PrevElement[j].querySelector('.button_play').getAttribute('href') == (`/music/${audio_player.src.split('/')[4]}`)) {
                            name_song.innerHTML = PrevElement[j].querySelector('.button_play').getAttribute('val')
                            deleteClass(PrevElement[j])
                            addClass(PrevElement[j])
                        } 
                    }
                    play_player.src = '/img/pause.png'
                    audio_player.play()
                } else {
                    audio_player.src = nextSong
                    for (let j = 0; j < PrevElement.length; j++) {
                        deleteClass(PrevElement[j])
                        if(PrevElement[j].querySelector('.button_play').getAttribute('href') == (`/music/${audio_player.src.split('/')[4]}`)) {
                            name_song.innerHTML = PrevElement[j].querySelector('.button_play').getAttribute('val')
                            addClass(PrevElement[j])
                        }
                    }
                    play_player.src = '/img/pause.png'
                    audio_player.play()
                }
                break;
            }
        }
    }

    function showVolumeSong() {
        change_size__volume.classList.remove('hideClass')
    }

    function hideVolumeSong() {
        change_size__volume.classList.add('hideClass')
    }

    function setVolumeProgress(e) {
        const width = this.clientWidth
        console.log(this.clientWidth)
        const clickPositionX = e.offsetX
        console.log(e.offsetX)

        const duration = 1.0

        audio_player.volume = (clickPositionX / width) * duration
        size_volume.style.width = `${clickPositionX}px`
    }

    playlist.addEventListener('click', (elem) => {

        if(elem.target.classList.contains('button_play')) {

            var song_name = elem.target.getAttribute('val')
            var dataSong =  elem.target.getAttribute('href')
            name_song.innerHTML = song_name
            const isPlaying = audio_player.classList.contains('playing')
        
            player.classList.remove('hideClass')

            if(isPlaying && ((`/music/${audio_player.src.split('/')[4]}`) != dataSong)) {
                for (let i = 0; i < PrevElement.length; i++) {

                    deleteClass(PrevElement[i])
                }
                elem.target.classList.add('playing_track')
                audio_player.src = dataSong
                play_player.src = '/img/pause.png'
                audio_player.play()
            } else {
                elem.target.classList.remove('playing_track')
                audio_player.classList.remove('playing')
                play_player.src = '/img/play.png'
                audio_player.pause()
            } 
            if(!isPlaying) {
                elem.target.classList.add('playing_track')
                audio_player.classList.add('playing')
                audio_player.src = dataSong
                play_player.src = '/img/pause.png'
                audio_player.play()
            }
        }
    })

    play_player.addEventListener('click', () => {

        const isPlaying = audio_player.classList.contains('playing')
        
        if(isPlaying) {
            for (let i = 0; i < PrevElement.length; i++) {
        
                deleteClass(PrevElement[i])
            }
            audio_player.classList.remove('playing')
            play_player.src = '/img/play.png'
            audio_player.pause();
        } else {
            for (let i = 0; i < PrevElement.length; i++) {
                
                addClass(PrevElement[i])
            }
            play_player.src = '/img/pause.png'
            audio_player.play()
        }
    })

    prev_player.addEventListener('click', (elem) => {
        audio_player.pause()
        for(let i = 0; i < musArray.length; i++) {
            if(musArray[i] == (`/music/${audio_player.src.split('/')[4]}`)) {
                let prevSong = musArray[i-1]
                if(prevSong == undefined) {
                    audio_player.src = musArray[0]
                    for (let j = 0; j < PrevElement.length; j++) {
                        if(PrevElement[j].querySelector('.button_play').getAttribute('href') == (`/music/${audio_player.src.split('/')[4]}`)) {
                            name_song.innerHTML = PrevElement[j].querySelector('.button_play').getAttribute('val')
                            deleteClass(PrevElement[j])
                            addClass(PrevElement[j])
                        } 
                    }
                    play_player.src = '/img/pause.png'
                    audio_player.play()
                } else {
                    audio_player.src = musArray[i-1]
                    for (let j = 0; j < PrevElement.length; j++) {
                        deleteClass(PrevElement[j])
                        if(PrevElement[j].querySelector('.button_play').getAttribute('href') == (`/music/${audio_player.src.split('/')[4]}`)) {
                            name_song.innerHTML = PrevElement[j].querySelector('.button_play').getAttribute('val')
                            addClass(PrevElement[j])
                        }
                    }
                    play_player.src = '/img/pause.png'
                    audio_player.play()
                }

            }
        }
    })

    next_player.addEventListener('click', nextSong)

    audio_player.addEventListener('timeupdate', progressBar)

    progress_container_player.addEventListener('click', setProgressInProgressBar)

    audio_player.addEventListener('ended', nextSong)

    volume_player.addEventListener('click', () => {
        const isHide = change_size__volume.classList.contains('hideClass')
        if(isHide) {
            showVolumeSong()
        } else {
            hideVolumeSong()
        }
    })

    change_size__volume.addEventListener('click', setVolumeProgress)
})