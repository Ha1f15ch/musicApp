document.addEventListener('DOMContentLoaded', () => {
    var btn_for_delete = document.querySelector('.btn_for_delete')
    btn_for_delete.addEventListener('click', async () => {
        console.log(btn_for_delete.getAttribute('id'), ' - Data Deleted')
        fetch(document.location.href, {
            method: 'DELETE'
        })
        .then(function(data) {
            window.location = 'https://mytestferssite.ru/v1/api/adminCatalog/janrs'
        })
    })

    var btn_for_edit = document.querySelector('.btn_for_edit')
    btn_for_edit.addEventListener('click', () => {
        var formData = document.querySelector('.form_new_data_janr')
        if(formData.classList.contains('hidden')) {
            formData.classList.remove('hidden')
        } else {
            formData.classList.add('hidden')
        }
    })

    var btn_for_back = document.querySelector('.btn_for_back')
    btn_for_back.addEventListener('click', async () => {
        window.location = "https://mytestferssite.ru/v1/api/adminCatalog/janrs"
    })

    var New_dataJanr = document.querySelector('.New_dataJanr')
    New_dataJanr.addEventListener('click', async () => {
        var NameJanrData = document.querySelector('.New_NameJanrData').value
        var DescriptionJanrData = document.querySelector('.New_descriptionsJanrData').value

        href = document.location.href
            try {
                var res = await fetch(href, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        "name": NameJanrData,
                        "descriptions": DescriptionJanrData,
                    })
                })
                if(res.ok) {
                    window.location = href
                } else {
                    window.location = href
                    setTimeout(alert('Введены уже существующие в системе данные'), 2000) 
                }
            } catch(e) {
                console.log(e)
            }
    })
})