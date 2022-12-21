exports.allAccess = (req, res) => {
    res.status(200).send({message: 'ALL ACCESS DATA'})
}

exports.userBoard = (req, res) => {
    res.status(200).send({message: 'user content'})
}

exports.adminAccess = (req, res) => {
    res.status(200).send({message: 'ADMIN DATA'})
}

exports.modderAccess = (req, res) => {
    res.status(200).send({message: 'MODDER DATA'})
}