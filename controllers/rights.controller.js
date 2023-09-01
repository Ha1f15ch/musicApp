var Rights = require('../models/rights.model');

const list = [
    'Чтение справочника',
    'Доступ к разделу администрирования',
    'Доступ к профилю пользователя',
    'Доступ к загрузке файла',
    'Доступ к изменению справочников',
    'Доступ к редактированию роли пользователя',
]

exports.list_rights = async (req, res, next) => {

    try {
        for(let i = 0; i < list.length; i++) {
            var newValueInDB = new Rights({
                name: list[i]
            })

            await Rights.findOne({
                'name': list[i]
            })
            .then((finVal) => {
                if(finVal) {
                    console.log('Такая запись уже есть')
                } else {
                    newValueInDB.save()
                    .then((res) => {
                        console.log('Выполнено успешно')
                    })
                    .catch((rej) => {
                        console.log('ошибка', rej)
                    })
                }
            })
            .catch((err) => {
                if(err) {
                    return next(err)
                }
            })
        }
    } catch(e) {
        console.log(e)
        next()
    }
    const rights = Rights.find()
    .then((result) => {
        res.render('pageRights', {
            title: 'Список прав',
            dataProperties: result
        })
    })
}