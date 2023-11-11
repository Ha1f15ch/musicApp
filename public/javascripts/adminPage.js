document.addEventListener('DOMContentLoaded', () => {
    
    const prev_href = 'https://mytestferssite.ru/v1/api/adminCatalog'
    const tempVal = 'http://localhost/v1/api/adminCatalog'

    var btn_global_search = document.querySelector('.btn_global_search')
    btn_global_search.addEventListener('click', async () => {
        var searchData = document.querySelector('.searchData').value
        console.log(searchData, ' - ищем - searchData')
        window.location.href = prev_href+`/generalSearch/${searchData}`
    })
})

