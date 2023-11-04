document.addEventListener('DOMContentLoaded', () => {
    var btn_back_to_roles = document.querySelector('.btn_back_to_roles')
    btn_back_to_roles.addEventListener('click', async () => {
        window.location = "https://mytestferssite.ru/v1/api/adminCatalog/roles"
    })
})