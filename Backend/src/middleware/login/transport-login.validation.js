const joi = require('joi')
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

const validateSignUp = (transport) => {
    const schema = joi.object({
        transportEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida'
        }),

        licensePlate: joi.string().required().messages({
            'string.base' : 'Patente: debe ser una cadena de texto',
            'any.required': 'Patente: es un requisito'
        }),

        routeNumber: joi.string().required().messages({
            'string.base' : 'Numero de ruta: debe ser una cadena de texto',
            'any.required': 'Numero de ruta: es un requisito'
        }),

        password: joiPassword.string().min(6).max(20).noWhiteSpaces().required().messages({
            'string.base' : 'Contraseña: debe ser una cadena de texto',
            'any.required': 'Contraseña: es un requisito',
        })
    })
    return schema.validate(transport);
}

const validateResend = (transport) => {
    const schema = joi.object({
        licensePlate: joi.string().required().messages({
            'string.base' : 'Patente: debe ser una cadena de texto',
            'any.required': 'Patente: es un requisito',
        })
    })
    return schema.validate(transport);
}

const validateConfirmationCode = (user) => {
    const schema = joi.object({
        licensePlate: joi.string().required().messages({
            'string.base' : 'Patente: debe ser una cadena de texto',
            'any.required': 'Patente: es un requisito'
        }),
        confirmationCode: joi.string().min(6).max(6).required().messages({
            'string.base' : 'Codigo: debe ser una cadena de texto',
            'string.min'  : 'Codigo: deberia tener solo 6 caracteres',
            'string.max'  : 'Codigo: deberia tener solo 6 caracteres',
            'any.required': 'Codigo: es un requisito'
        })
    })
    return schema.validate(user);
}

const validateSignIn = (transport) => {
    const schema = joi.object({
        licensePlate: joi.string().required().messages({
            'string.base' : 'Patente: debe ser una cadena de texto',
            'any.required': 'Patente: es un requisito',
        }),
        password: joiPassword.string().min(6).max(20).noWhiteSpaces().required().messages({
            'any.required'          : 'Contraseña: es un requisito',
            'password.noWhiteSpaces': 'Contraseña: no puede contener espacios en blanco'
        })
    })
    return schema.validate(transport);
}

const validateSignOut = (transport) => {
    const schema = joi.object({
        licensePlate: joi.string().required().messages({
            'string.base' : 'Patente: debe ser una cadena de texto',
            'any.required': 'Patente: es un requisito',
        })
    })
    return schema.validate(transport);
}

const transportLoginValidation = (req, res, next) => {
    // quita el "/" de la url -> si la url era /signup queda validationResolver.signup , con locual ejecuta User.validateSignup
    const { error } = transportValidationResolvers[req.url.slice(1)](req.body)
    if (error) return res.status(400).send({
        message: error.details[0].message,
        value: error.details[0]
    })
    next()
}

const transportValidationResolvers = {
    "sign-up":  (params) => validateSignUp(params),
    resend:     (params) => validateResend(params),
    confirm:    (params) => validateConfirmationCode(params),
    "sign-in":  (params) => validateSignIn(params),
    "sign-out": (params) => validateSignOut(params),
}

module.exports = { transportLoginValidation }