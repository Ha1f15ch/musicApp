document.addEventListener('DOMContentLoaded', () => {

    var btn_editauthData = document.querySelector('.btn_editauthData'),
    btn_editProfileData = document.querySelector('.btn_editProfileData')

    var btn_get_getPlaylist = document.querySelectorAll('.btn_get_getPlaylist')
    for(let j = 0; j < btn_get_getPlaylist.length; j++) {
        btn_get_getPlaylist[j].addEventListener('click', async () => {
            window.location = "https://mytestferssite.ru"+btn_get_getPlaylist[j].getAttribute('get_playlist')
        })
    }

    var btn_redirect = document.querySelectorAll('.btn_redirect')
    for(let k = 0; k < btn_redirect.length; k++) {
        btn_redirect[k].addEventListener('click', async () => {
            window.location = "https://mytestferssite.ru"+btn_redirect[k].getAttribute('dataForRedirect')
        })
    }

    btn_editauthData.addEventListener('click', () => {
        var userLoginData = document.querySelector('.userLoginData'),
            userEmailData = document.querySelector('.userEmailData'),
            btnSendAuthUserData = document.querySelector('.btnSendAuthUserData')
        if(userLoginData.hasAttribute('readonly') || userEmailData.hasAttribute('readonly')) {
            userLoginData.removeAttribute('readonly')
            userEmailData.removeAttribute('readonly')
            btnSendAuthUserData.classList.remove('hidden')
        } else {
            userLoginData.setAttribute('readonly', true)
            userEmailData.setAttribute('readonly', true)
            btnSendAuthUserData.classList.add('hidden')
        }
        btnSendAuthUserData.addEventListener('click', async () => {
            let href = document.location.href
   
            try {
   
               var res = await fetch(href, {
                   method: 'PUT',
                   headers: {
                       'Content-Type': 'application/json;charset=utf-8'
                   },
                   body: JSON.stringify({
                       "login": userLoginData.value,
                       "email": userEmailData.value
                   })
               })
               if(res.ok) {
                   window.location = href
               } else {
                   setTimeout(alert('Введены уже существующие в системе данные'), 500) 
                   window.location = href
               }
            } catch(e) {
               console.log('Ошибка - ', e)
            }
       })
    })

    btn_editProfileData.addEventListener('click', () => {
        var UserfirstNameData = document.querySelector('.UserfirstNameData'),
            UserlastNameData = document.querySelector('.UserlastNameData'),
            UsermidlNameData = document.querySelector('.UsermidlNameData'),
            UserageUserData = document.querySelector('.UserageUserData'),
            UseraboutUserData = document.querySelector('.UseraboutUserData'),
            btnSendProfileUserData = document.querySelector('.btnSendProfileUserData');

        if(UserfirstNameData.hasAttribute('readonly') || UserlastNameData.hasAttribute('readonly') || UsermidlNameData.hasAttribute('readonly') || UserageUserData.hasAttribute('readonly')) {
            UserfirstNameData.removeAttribute('readonly')
            UserlastNameData.removeAttribute('readonly')
            UsermidlNameData.removeAttribute('readonly')
            UserageUserData.removeAttribute('readonly')
            UseraboutUserData.classList.remove('hidden')
            btnSendProfileUserData.classList.remove('hidden')
        } else {
            UserfirstNameData.setAttribute('readonly', true)
            UserlastNameData.setAttribute('readonly', true)
            UsermidlNameData.setAttribute('readonly', true)
            UserageUserData.setAttribute('readonly', true)
            UseraboutUserData.classList.add('hidden')
            btnSendProfileUserData.classList.add('hidden')
        }
        btnSendProfileUserData.addEventListener('click', async () => {
            let prevHref = document.location.href
             let href = document.location.href + '/updateProfile'
    
             try {
    
                var res = await fetch(href, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        "firstName": UserfirstNameData.value,
                        "lastName": UserlastNameData.value,
                        "midlName": UsermidlNameData.value,
                        "ageUser": UserageUserData.value,
                        "aboutUser": UseraboutUserData.value
                    })
                })
                if(res.ok) {
                    window.location = prevHref
                } else {
                    window.location = prevHref
                    setTimeout(alert('Введены уже существующие в системе данные'), 2000) 
                }
             } catch(e) {
                console.log('Ошибка - ', e)
             }
        })
    })
})