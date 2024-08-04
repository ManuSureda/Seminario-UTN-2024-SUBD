const joi = require('joi')
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

const validateSignUp = (user) => {
    const schema =  joi.object({ 
        //tlds - options for TLD (top level domain) validation. By default, the TLD must be a valid name listed on the IANA registry.
        userEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida' 
        }), 

        password: joiPassword.string().min(6).max(20).noWhiteSpaces().required().messages({
            'string.base'           : 'Contraseña: debe ser una cadena de texto',
            'string.empty'          : 'Contraseña: se encuentra vacio',
            'string.min'            : 'Contraseña: minimo 6 caracteres',
            'string.max'            : 'Contraseña: maximo 20 caracteres',
            'password.noWhiteSpaces': 'Contraseña: no puede contener espacios en blanco',
            'any.required'          : 'Contraseña: requerida'
        }),
        
        dni: joi.string().pattern(/[0-9]+/).min(8).max(8).required().messages({
            'string.base'           : 'Dni: debe ser una cadena de texto',
            'string.empty'          : 'Dni: se encuentra vacio',
            'string.pattern.base'   : 'Dni: solo puede contener letras',
            'string.min'            : 'Dni: minimo 8 caracteres',
            'string.max'            : 'Dni: maximo 8 caracteres',
            'password.noWhiteSpaces': 'Dni: no puede contener espacios en blanco',
            'any.required'          : 'Dni: requerido'
        }),

        name: joi.string().pattern(/^[A-Za-z\s]+$/).min(1).max(256).required().messages({
            'string.base'        : 'Nombre: debe ser una cadena de texto',
            'string.empty'       : 'Nombre: se encuentra vacio',
            'string.pattern.base': 'Nombre: solo puede contener letras',
            'string.min'         : 'Nombre: minimo 6 caracteres',
            'string.max'         : 'Nombre: maximo 256 caracteres',
            'any.required'       : 'Nombre: requerido'
        }),

        lastName: joi.string().pattern(/^[A-Za-z\s]+$/).min(1).max(256).required().messages({
            'string.base'        : 'Apellido: debe ser una cadena de texto',
            'string.empty'       : 'Apellido: se encuentra vacio',
            'string.pattern.base': 'Apellido: solo puede contener letras',
            'string.min'         : 'Apellido: minimo 6 caracteres',
            'string.max'         : 'Apellido: maximo 256 caracteres',
            'any.required'       : 'Apellido: requerido'                
        }),

        province: joi.string().required().messages({
            'string.base' : 'Provincia: debe ser una cadena de texto',
            'any.required': 'Provincia: requerido'                
        }), //chekear si esto esta bien y reemplazar por getApiProvinces

        municipality: joi.string().required().messages({
            'string.base' : 'Municipio: debe ser una cadena de texto',
            'any.required': 'Municipio: requerido'                
        }),

        city: joi.string().required().messages({
            'string.base' : 'Ciudad: debe ser una cadena de texto',
            'any.required': 'Ciudad: requerido'                
        }),
        // revizar listado de zonas?
        postalCode: joi.string().pattern(/^\S+$/).min(4).required().messages({
            'string.base'        : 'Codigo postal: debe ser una cadena de texto',
            'string.empty'       : 'Codigo postal: se encuentra vacio',
            'string.min'         : 'Codigo postal: minimo 4 caracteres',
            'string.pattern.base': 'Codigo postal: no permite espacios en blanco',
            'any.required'       : 'Codigo postal: requerido'                
        }),

        emergencyContact: joi.string().pattern(/^\d+$/).min(10).max(12).messages({
            'string.base'        : 'Contacto de emergencia: debe ser una cadena de texto',
            'string.empty'       : 'Contacto de emergencia: se encuentra vacio',
            'string.pattern.base': 'Contacto de emergencia: ingrese solo numeros',
            'string.min'         : 'Contacto de emergencia: minimo 10 caracteres',
            'string.max'         : 'Contacto de emergencia: maximo 12 caracteres'
        }), // 54 223 5 123456

        healthInsurance: joi.string().min(1).max(256).messages({
            'string.base'        : 'Obra social: debe ser una cadena de texto',
            'string.empty'       : 'Obra social: se encuentra vacio',
            'string.min'         : 'Obra social: minimo 1 caracteres',
            'string.max'         : 'Obra social: maximo 256 caracteres'
        }),

        insurancePlan: joi.string().min(1).max(256).messages({
            'string.base'        : 'Plan: debe ser una cadena de texto',
            'string.empty'       : 'Plan: se encuentra vacio',
            'string.min'         : 'Plan: minimo 1 caracteres',
            'string.max'         : 'Plan: maximo 256 caracteres'
        })
        // faltaria province, city, postalCode, healthInsurance y insurancePlan. me gustaria que procince y city esten obligadas a ser las reales, tipo 
        // tener un arreglo con las ciudades y provincias argentinas y si o si tiene q estar ahi.
    });
    return schema.validate(user);
}

const validateConfirmationCode = (user) => {
    const schema = joi.object({
        userEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida' 
        }),
        confirmationCode: joi.string().min(6).max(6).required().messages({
            'string.base' : 'Codigo: debe ser una cadena de texto',
            'string.min'  : 'Codigo: deberia tener solo 6 caracteres',
            'string.max'  : 'Codigo: deberia tener solo 6 caracteres',
            'any.required': 'El correo electronico es un requisito'
        })
    })
    return schema.validate(user);
}

const validateLogin = (user) => {
    const schema = joi.object({
        userEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida' 
        }),
        password: joiPassword.string().min(6).max(20).noWhiteSpaces().required().messages({
            'password.noWhiteSpaces': 'Contraseña: no puede contener espacios en blanco'
        })
    })
    return schema.validate(user);
}

const validateLogout = (user) => {
    const schema = joi.object({
        userEmail: joi.string().email({ tlds: { allow: false } }).required()
    })
    return schema.validate(user);
}

const validateResend = (user) => {
    const schema = joi.object({
        userEmail: joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.base' : 'Correo electronico: debe ser una cadena de texto',
            'any.required': 'Correo electronico: es un requisito',
            'string.email': 'Correo electronico: direccion de correo invalida' 
        })
    })
    return schema.validate(user);
}

const clientLoginValidation = (req, res, next) => {
    // quita el "/" de la url -> si la url era /signup queda validationResolver.signup , con locual ejecuta User.validateSignup
    const { error } = authValidationResolvers[req.url.slice(1)](req.body)
    if (error) return res.status(400).send({
        message: error.details[0].message,
        value: error.details[0]
    })
    next()
}

const authValidationResolvers = {
    "sign-up": (params) => validateSignUp(params),
    resend:    (params) => validateResend(params),
    confirm:   (params) => validateConfirmationCode(params),
    "sign-in": (params) => validateLogin(params),
    "sign-out":    (params) => validateLogout(params),
}

module.exports = { clientLoginValidation }