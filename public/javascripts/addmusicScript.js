window.document.addEventListener('DOMContentLoaded', () => {
    try {
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
    } catch(e) {
        console.log(e)
    }

    const prev_href = 'https://mytestferssite.ru/v1/api/main'
    const tempVal = 'http://localhost/v1/api/main'

    var btn_global_search = document.querySelector('.btn_global_search')
    btn_global_search.addEventListener('click', async () => {
        var searchData = document.querySelector('.searchData').value
        console.log(searchData, ' - ищем - searchData')
        window.location.href = prev_href+`/generalSearch/${searchData}`
    })
})