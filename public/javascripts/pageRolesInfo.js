document.addEventListener('DOMContentLoaded', () => {
    var btn_back_to_roles = document.querySelector('.btn_back_to_roles')
    var listButtons = document.querySelectorAll('.deleteRight')
    const element = document.querySelector('.main-content')

    btn_back_to_roles.addEventListener('click', async () => {
        window.location = "https://mytestferssite.ru/v1/api/adminCatalog/roles"
    })

    for(let i = 0; i < listButtons.length; i++) {
        listButtons[i].addEventListener('click', async (event) => {
            var deletedRight = event.target.getAttribute('id')

            let parentElem = event.target.parentNode
            let parentParentMain = parentElem.parentNode
            
            const preload = document.location.href
            const href = document.location.href + '/UpdateRights'
            try {
                var res = await fetch(href, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({"deletedRight": deletedRight})
                })
                parentParentMain.classList.add('hidden')
                if(res.ok) {
                    window.location = preload
                }
            } catch(e) {
                console.log(e)
            }
        })
    }

    var sendCreateQuery = document.querySelector('.sendCreateQuery')
    sendCreateQuery.addEventListener('click', async () => {
        const selectData = document.querySelector('.selectData')
        console.log('Кнопка нажата')
        var dataRight = selectData.value
        console.log(dataRight, ' - Данные которые передаем')
        var href = document.location.href
        try {
            var res = await fetch(href, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({"dataRight": dataRight})
            })
            if(res.ok) {
                window.location = href
            } else {
                alert('Такая запись уже есть в роли, попробуйте выбрать другое право . . .')
                setTimeout(window.location = href, 2000)
            }
        } catch(e) {
            console.log(e)
        }
    })

    const btnForDelete = document.querySelector('.btnForDelete')
        btnForDelete.addEventListener('click', () => {
            let dataDelete = btnForDelete.getAttribute('id')
            console.log(dataDelete)
            fetch(document.location.href, {
                method: 'DELETE'
            })
            .then(function(data) {
                window.location = 'https://mytestferssite.ru/v1/api/adminCatalog/roles'
            })
        })
})