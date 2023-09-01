try {
    document.addEventListener('DOMContentLoaded', () => {
    var body = document.body
    //var aa = Document.
    var listButtons = document.querySelectorAll('.deleteRight')
    const element = document.querySelector('.main-content')
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
    const btnRole = document.querySelector('.btmRole')
    if(btnRole == null) {
        const btnForDelete = document.querySelector('.btnForDelete')
        btnForDelete.addEventListener('click', () => {
            let dataDelete = btnForDelete.getAttribute('id')
            console.log(dataDelete)
            fetch(document.location.href, {
                method: 'DELETE'
            })
            .then(function(data) {
                window.location = 'http://localhost:3000/v1/api/adminCatalog/roles'
            })
        })
    } else {
        btnRole.addEventListener('click', () => {
            document.addEventListener('DOMContentLoaded', () => {
                const btnForDelete = document.querySelector('.btnForDelete')
                btnForDelete.addEventListener('click', () => {
                    let dataDelete = btnForDelete.getAttribute('id')
                    console.log(dataDelete)
                    fetch(document.location.href, {
                        method: 'DELETE'
                    })
                    .then(function(data) {
                        window.location = 'http://localhost:3000/v1/api/adminCatalog/roles'
                    })
                })
            })

        })
        if(btnRole == null && btnForDelete == null) {
            let body = document.body
            body.innerHTML = '<h3>В справочнике прав нет данных</h3>'
        }
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
})
} catch(e) {
    console.log(e)
}
