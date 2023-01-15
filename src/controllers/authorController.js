const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');           //Bcrypt uses the Blowfish cipher algorithm.
const validator = require('email-validator')
const passwordValidator = require('password-validator');
const authorModel = require('../models/authorModel')

require('dotenv').config();
const { SECRET_KEY } = process.env;
const { isValidFormat, cutSpace } = require('../validator/validator')


// API- 1 || TO CREATE AUTHORS

const createAuthor = async function (req, res) {
    try {

        let { fname, lname, title, email, password } = req.body


        req.body.fname = cutSpace(fname)
        req.body.lname = cutSpace(lname)

        let schema = new passwordValidator();
        schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits(2).has().not().spaces().is().not().oneOf(['Passw0rd', 'Password123', 'mypassword']);
        let checkPassword = schema.validate(password)

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Please enter data in the request body" })
        }

        if (!fname) {
            return res.status(400).send({ status: false, msg: "fname is missing" })
        }
        if (!isValidFormat(fname)) {
            return res.status(400).send({ status: false, msg: "please enter first name in right format" })
        }


        if (!lname) {
            return res.status(400).send({ status: false, msg: "lname is missing" })
        }
        if (!isValidFormat(lname)) {
            return res.status(400).send({ status: false, msg: "please enter last name in right format" })
        }


        if (!title) {
            return res.status(400).send({ status: false, msg: "title is missing" })
        }
        if (!(title == "Mrs" || title == "Mr" || title == "Miss")) {
            return res.status(401).send({ error: "title has to be Mr or Mrs or Miss " })
        }


        if (!email) {
            return res.status(400).send({ status: false, msg: "email is missing" })
        }
        let checkEmail = validator.validate(email)
        if (!checkEmail) {
            return res.status(400).send({ status: false, msg: `please enter ${email} in valid format` })
        }
        let uniqueEmail = await authorModel.findOne({ email: email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: `${email} already exists` })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "password is missing" })
        }
        if (checkPassword === false) {
            return res.status(400).send({ status: false, msg: `${password} should have min 8 character + one Uppercase + one lowercase + min 2 digits + should not have any space + should not be one of these : Passw0rd, Password123,mypassword` })
        }

        const saltRounds = 10;
        req.body.password = await bcrypt.hash(password, saltRounds);        //salting and hashing for encrypting password

        let savedData = await authorModel.create(req.body)
        return res.status(201).send({ status: true, msg: " you are registered successfully", data: savedData })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const loginAuthor = async function (req, res) {
    try {
        let { email, password } = req.body;

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter data in request body" })
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "please enter email" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "please enter password " })
        }

        let user = await authorModel.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ status: false, msg: "email is incorrect " })
        }

        const passwordVarification = await bcrypt.compare(password, user.password);     //will return true or false boolean value
        if (!passwordVarification) {
            return res.status(400).send({ status: false, msg: "Password is incorrect " })
        }


        let token = jwt.sign(
            {
                authorId: user._id.toString(),
                batch: "radon",
                organisation: "functionUp"
            },
            SECRET_KEY,
            { expiresIn: "24hrs" }
        )

        res.setHeader("x-api-key", token)

        return res.status(200).send({ status: true, msg: "you are successfully loggedin", data: token })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = {
    createAuthor,
    loginAuthor
}