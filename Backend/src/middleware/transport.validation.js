const joi = require('joi')

const validateGetTransportData = (licensePlate) => {
    const schema = joi.string().required().messages({
            'string.base' : 'Patente: debe ser una cadena de texto',
            'any.required': 'Patente: es un requisito'
    })
    return schema.validate(licensePlate);
}

const validateUpdateRouteNumber = (licensePlate) => {
    const schema = joi.object({
        licensePlate: joi.string().required().messages({
            'string.base' : 'Patente: debe ser una cadena de texto',
            'any.required': 'Patente: es un requisito'
        }),
        routeNumber: joi.string().pattern(/^\d{3}[a-zA-Z]?$/).required().messages({
            'string.base'    : 'Linea: debe ser una cadena de texto',
            'string.pattern' : 'Linea: Linea: solo 3 numeros, + 1 letra opcional',
            'any.required'   : 'Linea: es un requisito'
        })
    }).required().messages({
        'object.base' : 'Formulario de modificacion: debe ser un objeto',
        'any.required': 'Formulario de modificacion: es un requisito'
    })
    return schema.validate(licensePlate);
}

const transportValidation = (req, res, next) => {

    if (req.url.slice(1).startsWith("?licensePlate=")) {
        const { licensePlate } = req.query
        const { error } = transportValidationResolvers["get-transport-data"](licensePlate)
        if (error) return res.status(400).send({
            message: error.details[0].message,
            value: error.details[0]
        })
        next()
    } else {
        // quita el "/" de la url -> si la url era /signup queda validationResolver.signup , con locual ejecuta User.validateSignup
        const { error } = transportValidationResolvers[req.url.slice(1)](req.body)
        if (error) return res.status(400).send({
            message: error.details[0].message,
            value: error.details[0]
        })
        next()
    }
    
}

const transportValidationResolvers = {
    "get-transport-data": (params) => validateGetTransportData(params),
    "update":             (params) => validateUpdateRouteNumber(params)
}

module.exports = { transportValidation }