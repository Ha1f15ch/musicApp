window.document.addEventListener('DOMContentLoaded', () => {
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
    const buttonTrackData = document.querySelectorAll('.buttonTrackData')

    var musArray = []
    var PrevElement = document.querySelectorAll('.song_item')
    var choosenElement_song
    var listModalDisplay = document.querySelectorAll('.modal') 
    var btn_playlist_id = document.querySelectorAll('.btn_playlist_id')
    var href = document.location.href
    var href_preload = document.location.href
    var btn_delete_icon = document.querySelectorAll('.btn_delete_icon')

    for(let j = 0; j < btn_delete_icon.length; j++) {
        btn_delete_icon[j].addEventListener('click', async () => {
            var Id_music = btn_delete_icon[j].getAttribute('data_song_id')
            var parent_imgIcon = btn_delete_icon[j].parentNode //div
            var rec_parent_imgIcon = parent_imgIcon.parentNode
            let prev_href = document.location.href
            let href = document.location.href+`/${Id_music}`

            fetch(href, {
                method: 'DELETE'
            })
            .then(function(data) {
                setTimeout(() => {
                    playlist.removeChild(rec_parent_imgIcon)
                    alert('Успешно удалено!')
                }, 1000);
            })
            .catch(function(errData) {
                console.log('Ошибка - ', errData)
                setTimeout(() => {
                    alert('Ошибкаа при удалении !')
                    document.location = prev_href
                }, 1000)
           })


        })
    }

    for(let j = 0; j < btn_playlist_id.length; j++) {
        btn_playlist_id[j].addEventListener('click', async () => {
            let mus_id = btn_playlist_id[j].getAttribute('id_song')
            let playlist_id = btn_playlist_id[j].getAttribute('id_playlist')

            href = `${href}/update/${playlist_id}/${mus_id}`

            try {
                var res = await fetch(href, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        "mus_id": mus_id,
                        "playlist_id": playlist_id
                    })
                })
                if(res.ok) {
                    console.log('Корректно записано')
                    href = href_preload
                    setTimeout(() => {
                        alert('Успешно добавлено') 
                        let showerClass = document.querySelector('.showerClass')
                        if(showerClass.classList.contains('showerClass')) {
                            showerClass.classList.remove('showerClass')
                        }
                    }, 1000)
                } else {
                    console.log('Возникла ошибка')
                    setTimeout(() => {
                        alert('При добавлении возникла ошибка')
                        window.location = href_preload
                    }, 2000)
                }
            } catch(e) {
                console.log('Ошибка при передаче данных или получении ответа- ', e)
                return e
            }
        })
    }

    function serchTrackForPlaylist(dataSerch) {
        
        for (let i = 0; i < dataSerch.length; i++) {
            dataSerch[i].addEventListener('click', (elem) => {
                console.log(elem.target, 'кнопка, по которой нажимаем для просмотра списка доступных плэйлистов') // кнопка, по которой нажимаем для просмотра списка доступных плэйлистов
                let ParentData = elem.target.closest('div')
                console.log(ParentData, ' - родительский элемент относительного того, по которому нажали')
                let itemWithPlaylists = ParentData.querySelector('.modal')
                itemWithPlaylists.classList.add('showerClass')
                let buttonCloseModal = ParentData.querySelector('.close')
                buttonCloseModal.addEventListener('click', () => {
                    itemWithPlaylists.classList.remove('showerClass')
                })
                choosenElement_song = elem.target.getAttribute('data_song_id')
            })
        }
    }

    serchTrackForPlaylist(buttonTrackData);
    
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