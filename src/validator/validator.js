const mongoose = require('mongoose')

const isValidFormat = function (value) {
    try {
        const nameRegex = /^[a-zA-Z ]+$/
        return nameRegex.test(value)
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const cutSpace = function (value) {
    try {
        return value.replace(/\s+/g, "")
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const cutBlogSpace = function (value) {
    try {
        return value.replace(/\s+/g, " ")
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = {
    isValidFormat,
    cutSpace,
    cutBlogSpace
}