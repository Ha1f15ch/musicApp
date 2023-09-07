document.addEventListener('DOMContentLoaded', () => {
    const btnRole = document.querySelector('.btmRole')
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