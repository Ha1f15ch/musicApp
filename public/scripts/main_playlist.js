window.document.addEventListener('DOMContentLoaded', () => {
    const playlist = document.querySelector('.playlist')

    var PrevElement = document.querySelectorAll('.song_item')
    console.log(PrevElement)

    const player = document.querySelector('.player')
    const name_song = document.querySelector('.name_song')
    const audio_player = document.querySelector('.audio_player')
    const play_player = document.querySelector('.play_player')
    const prev_player = document.querySelector('.prev_player_img')
    const next_player = document.querySelector('.next_player_img')
    const progress_container_player = document.querySelector('.progress_container_player')
    const progress_player = document.querySelector('.progress_player')

    var musArray = []
    for(let i = 0; i < PrevElement.length; i++) {
        let tempValDataSongItem = PrevElement[i].querySelector('.button_play')
        let DataSRCSong = tempValDataSongItem.getAttribute('href')
        musArray.push(DataSRCSong)
    }
    const longMusArray = musArray.length
    console.log(musArray)

    function playForPlayerFunction() {}

    function deleteClass(classValue) {
        classValue.querySelector('.button_play').classList.remove('playing_track')
    }

    function addClass(classValue) {
        if(classValue.querySelector('.button_play').getAttribute('href') == (`/music/${audio_player.src.split('/')[4]}`)) {
            classValue.querySelector('.button_play').classList.add('playing_track')
            audio_player.classList.add('playing')
            return true
        } else {
            console.log('Error in load href-s song item')
        }
    }



    playlist.addEventListener('click', (elem) => {
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
        console.log(elem.target)
        for(let i = 0; i < musArray.length; i++) {
            if(musArray[i] == (`/music/${audio_player.src.split('/')[4]}`)) {
                let prevSong = musArray[i-1]
                console.log(musArray[i-1])
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
                    console.log(audio_player.src, 'перед правильным условием')
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

    next_player.addEventListener('click', (elem) => {
        audio_player.pause()
        console.log(elem.target)
        for(let i = 0; i < musArray.length; i++) {
            if(musArray[i] == (`/music/${audio_player.src.split('/')[4]}`)) { //определяется текущий элемент
                let nextSong = musArray[i+1]
                console.log(nextSong)
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
                    console.log(audio_player.src, 'перед правильным условием')
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
            } else {
                console.log('МИМО')
            }
        }
    })
})