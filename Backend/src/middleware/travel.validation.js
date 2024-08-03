const joi = require('joi')

const validateGetIn = (request) => {
    const schema = joi.object({
        transportData: joi.object({
            licensePlate: joi.string().required().messages({
                'string.base' : 'Patente: debe ser una cadena de texto',
                'any.required': 'Patente: es un requisito'
            }),
            routeNumber: joi.string().required().messages({
                'string.base' : 'Numero de ruta: debe ser una cadena de texto',
                'any.required': 'Numero de ruta: es un requisito'
            }),
            routeOption: joi.string().required().messages({
                'string.base' : 'Seccion de ruta: debe ser una cadena de texto',
                'any.required': 'Seccion de ruta: es un requisito'
            }),
            ticketDate: joi.date().required().messages({
                'date.base'   : 'Fecha: debe ser una fecha valida',
                'any.required': 'Fecha: es un requisito'
            }),
            gpsLocation: joi.any().messages({
                'string.base' : 'Ubicacion GPS: debe ser una cadena de texto',
                'any.required': 'Ubicacion GPS: es un requisito'
            })
        }).required().messages({
            'any.required': 'Datos de transporte: es un requisito'
        }),

        clientData: joi.object({
            get: joi.string().valid("in").required().messages({
                'string.base' : 'Tipo de operacion: debe ser una cadena de texto',
                'any.required': 'Tipo de operacion: es un requisito',
                'string.valid': 'Intenta registrar un desenso en una operacion de abordaje'
            }),
            payerEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
                'string.base' : 'Correo electronico: debe ser una cadena de texto',
                'any.required': 'Correo electronico: es un requisito',
                'string.email': 'Correo electronico: direccion de correo invalida'
            }),
            payerSub: joi.string().required().messages({
                'string.base' : 'Sub: debe ser una cadena de texto',
                'any.required': 'Sub: es un requisito'
            }),
            guestEmail: joi.string().email({ tlds: { allow: false } }).messages({
                'string.base' : 'Correo electronico de invitado: debe ser una cadena de texto',
                'string.email': 'Correo electronico de invitado: direccion de correo invalida'
            }),
            guestDni:joi.string().messages({
                'string.base' : 'DNI de invitado: debe ser una cadena de texto'
            })
        }).required().messages({
            'any.required': 'Datos del cliente: es un requisito'
        }),
        onlinePayment: joi.boolean().required()
    })
    return schema.validate(request);
}

const validateGetOut = (request) => {
    const schema = joi.object({
        userEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida'
        }),
        travelDate: joi.date().required().messages({
            'date.base'   : 'Fecha (ascenso): debe ser una fecha valida YYYY-MM',
            'any.required': 'Fecha (ascenso): es un requisito'
        }),
        routeNumber: joi.string().required().messages({
            'string.base' : 'Numero de ruta: debe ser una cadena de texto',
            'any.required': 'Numero de ruta: es un requisito'
        }),
        outDate: joi.date().required().messages({
            'date.base'   : 'Fecha (descenso): debe ser una fecha valida YYYY-MM',
            'any.required': 'Fecha (descenso): es un requisito'
        }),
        outLocation: joi.object({
            lat: joi.string().required().messages({
                'string.base' : 'Latitud: debe ser una cadena de texto',
                'any.required': 'Latitud: es un requisito'
            }),
            lon: joi.string().required().messages({
                'string.base' : 'Longitud: debe ser una cadena de texto',
                'any.required': 'Longitud: es un requisito'
            })
        })
    })
    return schema.validate(request);
}

const travelValidation = (req, res, next) => {
    // quita el "/" de la url -> si la url era /signup queda validationResolver.signup , con locual ejecuta User.validateSignup
    console.log("travel.validation:  travelValidation");
    console.log(req.url.slice(1));
    const { error } = travelValidationResolvers[req.url.slice(1)](req.body)
    if (error) return res.status(400).send({
        message: error.details[0].message,
        value: error.details[0]
    })
    next()
}

const travelValidationResolvers = {
    "get-in": (params) => validateGetIn(params),
    "get-out": (params) => validateGetOut(params)
}

module.exports = {travelValidation}