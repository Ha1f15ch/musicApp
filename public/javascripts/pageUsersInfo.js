document.addEventListener('DOMContentLoaded', () => {
    const updateUserData = document.querySelector('.updateUserData')
    updateUserData.addEventListener('click', () => {
        const userData = document.querySelector('.userData')
        if(userData.classList.contains('hidden')) {
            userData.classList.remove('hidden')
        } else {
            userData.classList.add('hidden')
        }
    })
    const sendNewData = document.querySelector('.sendNewData')
    sendNewData.addEventListener('click', async () => {
        var loginData = document.querySelector('.loginData').value
        var emailData = document.querySelector('.emailData').value
        console.log(loginData + ' - ' + emailData)

        let preload = document.location.href
        let href = document.location.href + '/update'
        try {
            var res = await fetch(href, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "login": loginData,
                    "email": emailData
                })
            })
            if(res.ok) {
                window.location = preload
            } else {
                alert('Такая запись login или email уже есть в системе, попробуйте выбрать другое значение. . .')
                setTimeout(window.location = preload, 2000)
            }
        } catch(e) {
            console.log('Возникла ошибка - ', e)
        }
    })
    const addRoleToUser = document.querySelector('.addRoleToUser')
    addRoleToUser.addEventListener('click', () => {
        const listRoles = document.querySelector('.listRoles')
        if(listRoles.classList.contains('hidden')) {
            listRoles.classList.remove('hidden')
        } else {
            listRoles.classList.add('hidden')
        }
    })
    const updateRoleList = document.querySelector('.updateRoleList')
    updateRoleList.addEventListener('click', async () => {
        var listRoles = document.querySelectorAll('.itemRole')
        console.log(listRoles, ' - Лист ролей')
        var arrayCheckedRoles = []
        for(let i = 0; i < listRoles.length; i++) {
            if(listRoles[i].checked) {
                arrayCheckedRoles.push(listRoles[i].value)
            }
        }
        console.log(arrayCheckedRoles)
        let preload = document.location.href
        let href = document.location.href + '/updateRole'
        try {
            var res = await fetch(href, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "RoleData": arrayCheckedRoles
                })
            })
            if(res.ok) {
                window.location = preload
            } else {
                alert('Такая роль уже есть у данного пользователя. . .')
                setTimeout(window.location = preload, 2000)
            }
        } catch(e) {
            console.log('Возникла ошибка - ', e)
        }
    })

    const menuDeleteRole = document.querySelector('.menuDeleteRole')
    menuDeleteRole.addEventListener('click', () => {
        var listRoles = document.querySelector('.list-roles')
        if(listRoles.classList.contains('hidden')) {
            listRoles.classList.remove('hidden')
        } else {
            listRoles.classList.add('hidden')
        }
    })

    var massDeleteRoleBTN = document.querySelectorAll('.deleteRole')
    for(let i = 0; i < massDeleteRoleBTN.length; i++) {
        massDeleteRoleBTN[i].addEventListener('click', async (event) => {
            var deletedRole = event.target.getAttribute('id')

            let parentElem = event.target.parentNode
            let parentParentMain = parentElem.parentNode
            
            const preload = document.location.href
            const href = document.location.href + '/deleteRole'
            try {
                var res = await fetch(href, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({"deletedRole": deletedRole})
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

    var addUserProfileData = document.querySelector('.addUserProfileData')
    addUserProfileData.addEventListener('click', () => {
        var userProfileData = document.querySelector('.userProfileData')
        if(userProfileData.classList.contains('hidden')) {
            userProfileData.classList.remove('hidden')
        } else {
            userProfileData.classList.add('hidden')
        }
    })

    var sendNewProfileData = document.querySelector('.sendNewProfileData')
    sendNewProfileData.addEventListener('click', async () => {
        var firstNameData = document.querySelector('.firstNameData').value
        var lastNameData = document.querySelector('.lastNameData').value
        var midlNameData = document.querySelector('.midlNameData').value
        var ageUserData = document.querySelector('.ageUserData').value
        var aboutUserData = document.querySelector('.aboutUserData').value

        const preload = document.location.href
            const href = document.location.href + '/updateProfile'
            try {
                var res = await fetch(href, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        "firstNameData": firstNameData,
                        "lastNameData": lastNameData,
                        "midlNameData": midlNameData,
                        "ageUserData": ageUserData,
                        "aboutUserData": aboutUserData
                    })
                })
                if(res.ok) {
                    window.location = preload
                }
            } catch(e) {
                console.log(e)
            }
    })
})