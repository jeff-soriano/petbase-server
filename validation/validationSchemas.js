const getValidSchema = {
    username: {
        in: ["params"],
        isEmail: true
    }
}

module.exports = {
    getValidSchema
}