const joi = require('joi')

const validateGetUserData = (userEmail) => {
    const schema = joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida' 
        })
    console.log("response");
    const response = schema.validate(userEmail);
    console.log(response);
    return response;
}

const clientValidation = (req, res, next) => {
    // quita el "/" de la url -> si la url era /signup queda validationResolver.signup , con locual ejecuta User.validateSignup
    if (req.url.slice(1).startsWith("?userEmail=")) {
        const { userEmail } = req.query
        const { error } = clientValidationResolvers["get-user-data"](userEmail)
        if (error) return res.status(400).send({
            message: error.details[0].message,
            value: error.details[0]
        })
        next()
    } else {
        // quita el "/" de la url -> si la url era /signup queda validationResolver.signup , con locual ejecuta User.validateSignup
        const { error } = clientValidationResolvers[req.url.slice(1)](req.body)
        if (error) return res.status(400).send({
            message: error.details[0].message,
            value: error.details[0]
        })
        next()
    }
}

const clientValidationResolvers = {
    "get-user-data": (params) => validateGetUserData(params)
}

module.exports = { clientValidation }