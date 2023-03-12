window.document.addEventListener('DOMContentLoaded', () => {
    const playlist = document.querySelector('.playlist')
    const img_playlist_item = document.querySelector('.button_play_image')

    var PrevElement = document.querySelectorAll('.song_item')
    console.log(PrevElement)

    const player = document.querySelector('.player')
    const name_song = document.querySelector('.name_song')
    const audio_player = document.querySelector('.audio_player')
    const buttons_player = document.querySelector('.buttons_player')
    const prev_player = document.querySelector('.prev_player')
    const play_player = document.querySelector('.play_player')
    const next_player = document.querySelector('.next_player')
    const progress_container_player = document.querySelector('.progress_container_player')
    const progress_player = document.querySelector('.progress_player')

    playlist.addEventListener('click', (elem) => {
        console.log(elem.target)
        var song_name = elem.target.getAttribute('val')
        var dataSong =  elem.target.getAttribute('href')
        name_song.innerHTML = song_name
        const isPlaying = audio_player.classList.contains('playing')

        if(isPlaying && ((`/music/${audio_player.src.split('/')[4]}`) != dataSong)) {
            for (let i = 0; i < PrevElement.length; i++) {
                console.log(PrevElement[i])
                function deleteClass(classValue) {
                    classValue.querySelector('.button_play').classList.remove('playing_track')
                }
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
})