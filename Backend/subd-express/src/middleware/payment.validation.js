const joi = require('joi')

const validatePaymentMP = (request) => {
    const schema = joi.object({
        userEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida' 
        }),
        amount: joi.number().min(1).required().messages({
            'number.base' : 'Cantidad: debe ser un numero',
            'number.min'  : 'Cantidad: debe ser al menos 1.00',
            'any.required': 'Correo electronico: es un requisito' 
        })
    })
    return schema.validate(request);
}

const paymentValidation = (req, res, next) => {
    // quita el "/" de la url -> si la url era /signup queda validationResolver.signup , con locual ejecuta User.validateSignup
    const { error } = paymentValidationResolvers[req.url.slice(1)](req.body)
    if (error) return res.status(400).send({
        message: error.details[0].message,
        value: error.details[0]
    })
    next()
}

const paymentValidationResolvers = {
    "mp/deposit": (params) => validatePaymentMP(params)
}

module.exports = {paymentValidation}