document.addEventListener('DOMContentLoaded', () => {
    
    const sent_score_value = document.querySelector('.sent_score_value')

    const prev_href = document.location.href
    const href = document.location.href + '/editScore'

    sent_score_value.addEventListener('click', async () => {

        const score_value = document.querySelector('.score_value').value
        console.log(score_value.value)

        try {
            var res = await fetch(href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "UsersScore": score_value
                })
            })

            if(res.ok) {
                console.log('Значение отправлено на сервер')
                alert('Принято')
                window.location = prev_href
            } else {
                setTimeout(() => {
                    alert('Возникла ошибка') 
                    window.location = prev_href
                }, 500)
            }
        } catch(e) {
            console.log(e)
        }
    })
})