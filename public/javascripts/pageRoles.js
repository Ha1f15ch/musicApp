document.addEventListener('DOMContentLoaded', () => {
    var btnRole = document.querySelectorAll('.btmRole')

    for(let i = 0; i < btnRole.length; i++) {
        btnRole[i].addEventListener('click', async () => {
            window.location = "https://mytestferssite.ru"+btnRole[i].getAttribute('itemRoleData')
        })
    }

    const btnCreateNewRole =  document.querySelector('.btnCreateNewRole')
    btnCreateNewRole.addEventListener('click', async () => {
        let listItems = document.querySelectorAll('.checkbox-input')
        let nameData = document.querySelector('.nameData').value
        let mass = []
        
        for(let i = 0; i < listItems.length; i++) {
            if(listItems[i].checked) {
                mass.push(listItems[i].value)
            }
        }
        const href = document.location.href
        var res = await fetch(href, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "name": nameData,
                "dataRights": mass
            })
        })
        if(res.ok) {
            window.location = href
        }
    })

    const arrayData = document.querySelector('.arrayData')
    arrayData.addEventListener('click', () => {
        let CreateBtn = document.querySelector('.CreateBtn')
        if(CreateBtn.classList.contains('hidden')) {
            CreateBtn.classList.remove('hidden')
        } else {
            CreateBtn.classList.add('hidden')
        }
        
    })
})