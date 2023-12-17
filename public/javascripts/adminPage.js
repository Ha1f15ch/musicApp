document.addEventListener('DOMContentLoaded', () => {

    const btn_for_choose_color = document.querySelector('.switchToDark_input')
    const root = document.documentElement

    btn_for_choose_color.addEventListener('click', async () => {
        if(!btn_for_choose_color.hasAttribute('checked')) {
            //Значит включен темный режим
            root.style.setProperty('--theme-background-color', '#0e1416')
            root.style.setProperty('--theme-color', '#b99e9e')
            root.style.setProperty('--theme-background-color-for-songItem', '#464438')
            console.log(btn_for_choose_color)
            btn_for_choose_color.setAttribute('checked', true)
            localStorage.setItem('theme', 'dark')
        } else {
            //Значит включен светлый режим
            root.style.setProperty('--theme-background-color', '#d3cfcf')
            root.style.setProperty('--theme-color', '#111e22')
            root.style.setProperty('--theme-background-color-for-songItem', '#adc3ec')
            console.log(btn_for_choose_color)
            btn_for_choose_color.removeAttribute('checked')
            localStorage.setItem('theme', 'light')
        }
    })

    if(localStorage.getItem('theme') == 'dark') {
        //Значит включен темный режим
        localStorage.setItem('theme', 'dark')
        btn_for_choose_color.setAttribute('checked', true)
        root.style.setProperty('--theme-background-color', '#0e1416')
        root.style.setProperty('--theme-color', '#b99e9e')
        root.style.setProperty('--theme-background-color-for-songItem', '#464438')
    } else {
        //Значит включен светлый режим
        localStorage.setItem('theme', 'light')
        btn_for_choose_color.removeAttribute('checked')
        root.style.setProperty('--theme-background-color', '#d3cfcf')
        root.style.setProperty('--theme-color', '#111e22')
        root.style.setProperty('--theme-background-color-for-songItem', '#adc3ec')
    }
    
    const prev_href = 'https://mytestferssite.ru/v1/api/adminCatalog'
    const tempVal = 'http://localhost/v1/api/adminCatalog'

    var btn_global_search = document.querySelector('.btn_global_search')
    btn_global_search.addEventListener('click', async () => {
        var searchData = document.querySelector('.searchData').value
        console.log(searchData, ' - ищем - searchData')
        window.location.href = prev_href+`/generalSearch/${searchData}`
    })

    var search_section = document.querySelector('.search_section') //Рутовый элемент поиска
    var music_search = document.querySelector('.music_search') //Рутовый элемент композиций
    var janrs_search = document.querySelector('.janrs_search') //Рутовый элемент жанров
    var users_search = document.querySelector('.users_search') //Рутовый элемент пользователей
    var searchData = document.querySelector('.searchData')

    searchData.addEventListener('keyup', async () => {
        music_search.innerHTML = ''
        janrs_search.innerHTML = ''
        users_search.innerHTML = ''
        
        if(!searchData.value) {

            console.log('Ничего не введено, ничего не отправляем . . .')
            search_section.classList.add('hidden')

        } else {
            search_section.classList.remove('hidden')

            const response = await fetch(prev_href+`/fastSearch/${searchData.value}`) 
            const {show_composition, show_janrs, show_users, errMSSG} = await response.json()
            const regex = new RegExp(searchData.value, 'gi')

            if(show_composition.length == 0) {
                let html_err = `
                    <li class="list-group-item">
                        <span>
                            ${errMSSG}
                        </span>
                    </li>
                `
                music_search.innerHTML = html_err

            } else {
                let html = show_composition.map(composition => {

                    let editedName = composition.name.replace(regex, `
                        <span class="high">${searchData.value}</span>
                    `)
                    return `
                        <li class="list-group-item">
                            <span>
                                <a href="/v1/api/adminCatalog/music/${composition._id}">
                                    ${editedName}
                                </a>
                            </span>
                        </li>
                    `
                }).join('')
                music_search.innerHTML = html
            }

            if(show_janrs.length == 0) {
                let html_err = `
                    <li class="list-group-item">
                        <span>
                            ${errMSSG}
                        </span>
                    </li>
                `
                janrs_search.innerHTML = html_err
            } else {
                let html = show_janrs.map(janrs => {

                    let editedName = janrs.name.replace(regex, `
                        <span class="high">${searchData.value}</span>
                    `)
                    return `
                        <li class="list-group-item">
                            <span>
                                <a href="/v1/api/adminCatalog/janrs/${janrs._id}">
                                    ${editedName}
                                </a>
                            </span>
                        </li>
                    `
                }).join('')
                janrs_search.innerHTML = html
            }

            if(show_users.length == 0) {
                let html_err = `
                    <li class="list-group-item">
                        <span>
                            ${errMSSG}
                        </span>
                    </li>
                `
                users_search.innerHTML = html_err
            } else {
                let html = show_users.map(users => {

                    let editedName = users.login.replace(regex, `
                        <span class="high">${searchData.value}</span>
                    `)
                    return `
                        <li class="list-group-item">
                            <span>
                                <a href="/v1/api/adminCatalog/users/${users._id}">
                                    ${editedName}, Почта: ${users.email}
                                </a>
                            </span>
                        </li>
                    `
                }).join('')
                users_search.innerHTML = html
            }
            
        }
    })
})

