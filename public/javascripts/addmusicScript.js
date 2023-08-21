window.document.addEventListener('DOMContentLoaded', () => {
    var btn1Addtrack = document.querySelector('.btn1-addtrack')
    var btnCreateMusic = document.querySelector('.btnCreateMusic')
    var btn_send_form_create_track = document.querySelector('.btn_send_form_create_track')

    btnCreateMusic.addEventListener('click', async () => {
        if(btn1Addtrack.classList.contains('hidden')) {
            btn1Addtrack.classList.remove('hidden')
        } else {
            btn1Addtrack.classList.add('hidden')
        }
    })  

    btn_send_form_create_track.addEventListener('click', () => {
        console.log(11)
        var form_control = document.querySelector('.form-control')
        console.log(form_control.value)
    })
})