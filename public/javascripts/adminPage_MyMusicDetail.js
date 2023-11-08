document.addEventListener('DOMContentLoaded', () => {
    var btn_for_update_music = document.querySelector('.btn_for_update_music')
    btn_for_update_music.addEventListener('click', () => {
        var block_with_hidden = document.querySelector('.block_with_update_data')
        if(block_with_hidden.classList.contains('hidden')) {
            block_with_hidden.classList.remove('hidden')
        } else {
            block_with_hidden.classList.add('hidden')
        }
    })

    var btn_submit_send_data = document.querySelector('.btn_submit_send_data')
    btn_submit_send_data.addEventListener('click', async () => {
        var name_music = document.querySelector('.name_value').value
        var array_janrs = document.querySelectorAll('.janr_item_data')
        var selected_array_janrs =[]
        var description_music = document.querySelector('.description_value').value

        for(let i = 0; i < array_janrs.length; i++) {
            if(array_janrs[i].checked == true) {
                
                selected_array_janrs.push(array_janrs[i].getAttribute('id'))
            }
        }

        let href = document.location.href

        try {

            var res = await fetch(href, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "name": name_music,
                    "array_janrs": selected_array_janrs,
                    "description": description_music
                })
            })
            if(res.ok) {
                window.location = href
            } else {
                setTimeout(() => {
                    alert('При изменении возникла ошибка!! Введены неверные данные или ошибка сервера')
                    window.location = href
                }, 750);
            }

        } catch(e) {
            return e
        }

    })
})