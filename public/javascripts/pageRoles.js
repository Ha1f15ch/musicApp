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
})

