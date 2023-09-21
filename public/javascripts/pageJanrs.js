document.addEventListener('DOMContentLoaded', () => {
    var btn_addNewJanr = document.querySelector('.BTN_addNewJanr')
    btn_addNewJanr.addEventListener('click', () => {
        var addNewJanr = document.querySelector('.addNewJanr')
        if(addNewJanr.classList.contains('hidden')) {
            addNewJanr.classList.remove('hidden')
        } else {
            addNewJanr.classList.add('hidden')
        }
    })
    var sendNewJanr = document.querySelector('.sendNewJanr')
    sendNewJanr.addEventListener('click', async () => {
        var NameJanrData = document.querySelector('.NameJanrData').value
        var descriptionsJanrData = document.querySelector('.descriptionsJanrData').value

        const href = document.location.href
        var res = await fetch(href, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "name": NameJanrData,
                "descriptions": descriptionsJanrData
            })
        })
        if(res.ok) {
            window.location = href
        }
    })
})