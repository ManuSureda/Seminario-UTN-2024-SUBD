const express = require('express')
// --- middleware ---
const { transportLoginValidation } = require('../../middleware/login/transport-login.validation')
// --- services ---
const TransportAuthService = require('../../services/auth/transport-auth.service')

const routes = express.Router({
    mergeParams: true
})//permite que los parámetros de ruta definidos en los enrutadores superiores sean accesibles en los enrutadores secundarios.

routes.post('/sign-up', transportLoginValidation, async (req, res) => {
    try {
        const newTransport = req.body    
        await TransportAuthService.signUp(newTransport)
        return res.status(201).send({ message: "Vehiculo registrado con exito, solo queda confirmar la cuenta" })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

routes.post('/confirm', transportLoginValidation, async (req, res) => {

    const { licensePlate, confirmationCode } = req.body
    try {
        await TransportAuthService.confirmAccount(licensePlate, confirmationCode)
        return res.status(200).send({ message: "Transporte confirmado con exito :)" })
    } catch (error) {
        if (error.code === "UserNotFoundException") {
            return res.status(400).send({ message: "No existe ningun transporte con dicho correo electronico" })
        } else if (error.code === "NotAuthorizedException") {
            if (error.message === "User cannot be confirmed. Current status is CONFIRMED") {
                return res.status(400).send({ message: "El transporte ya se encuentra confirmado" });
            }
            return res.status(400).send(error)
        } else if (error.code === "CodeMismatchException") {
            if (error.message === "Invalid verification code provided, please try again.") {
                return res.status(400).send({ message: "Codigo de confirmacion incorrecto" });
            }
            return res.status(400).send(error)
        } else {
            return res.status(400).send(error)
        }
    }
})

routes.post('/resend', transportLoginValidation, async (req, res) => {
    const { licensePlate } = req.body
    try {
        await TransportAuthService.reSendConfirmationCode(licensePlate)
        return res.status(200).send({ message: "Codigo re enviado con exito." })
    } catch (error) {
        console.log(error);
        if (error.code === "UserNotFoundException") {
            return res.status(400).send({ message: "No existe ningun transporte con dicho correo electronico" })
        } else {
            return res.status(400).send(error)
        }
    }
})

routes.post('/sign-in', transportLoginValidation, async(req, res) => {

    const { licensePlate, password } = req.body
    try {
        const result = await TransportAuthService.signIn(licensePlate, password)
        console.log("-----------------result sign in transport---------------");
        console.log(result.getAccessToken().getJwtToken());
        console.log("---------------------------------------");
        const response = {
            access_token : result.getAccessToken().getJwtToken()
        }
        
        return res.status(200).send(response)
    } catch (error) {
        console.log(error)
        if (error.name === "UserNotConfirmedException") {
            return res.status(400).send({ message: "El transporte fue registrado, pero aun no ha confirmado su cuenta, por favor verifique su casilla de correo (verifique tambien el spam)" } );
        }
        if (error.name === "NotAuthorizedException") {
            return res.status(401).send({ message: "Correo electronico o contraña incorrectos" } );
        }
        return res.status(400).send(error)
    }
})

routes.post('/sign-out', transportLoginValidation, (req, res) => {
    const { userEmail } = req.body
    const isLogout = AuthService.logout(userEmail)
    if (!isLogout) return res.status(400).send({ message: 'El transporte ya se encuentra des conectado' })
    return res.status(200).send({ message: 'Hasta pronto' })
})

module.exports = { routes }