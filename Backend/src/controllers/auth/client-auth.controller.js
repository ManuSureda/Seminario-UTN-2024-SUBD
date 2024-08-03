const express = require('express')
// --- middleware ---
const { clientLoginValidation } = require('../../middleware/login/client-login.validation')
// --- services ---
const ClientAuthService = require('../../services/auth/client-auth.service')

const routes = express.Router({
    mergeParams: true
})//permite que los parámetros de ruta definidos en los enrutadores superiores sean accesibles en los enrutadores secundarios.

routes.post('/sign-up', clientLoginValidation, async (req, res) => {
    const newUser = req.body
    
    try {
        await ClientAuthService.signUp(newUser)
        return res.status(201).send({ message: "Usuario registrado con exito, solo queda confirmar la cuenta" })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

routes.post('/confirm', clientLoginValidation, async (req, res) => {

    const { userEmail, confirmationCode } = req.body
    try {
        await ClientAuthService.confirmAccount(userEmail, confirmationCode)
        return res.status(200).send({ message: "Usuario confirmado con exito :)" })
    } catch (error) {
        if (error.code === "UserNotFoundException") {
            return res.status(400).send({ message: "No existe ningun usuario con dicho correo electronico" })
        } else if (error.code === "NotAuthorizedException") {
            if (error.message === "User cannot be confirmed. Current status is CONFIRMED") {
                return res.status(400).send({ message: "El usuario ya se encuentra confirmado" });
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

routes.post('/resend', clientLoginValidation, async (req, res) => {
    const { userEmail } = req.body
    try {
        const response = await ClientAuthService.reSendConfirmationCode(userEmail)
        return res.status(200).send({ message: "Codigo re enviado con exito." })
    } catch (error) {
        console.log(error);
        if (error.code === "UserNotFoundException") {
            return res.status(400).send({ message: "No existe ningun usuario con dicho correo electronico" })
        } else {
            return res.status(400).send(error)
        }
    }
})

routes.post('/sign-in', clientLoginValidation, async(req, res) => {

    const { userEmail, password } = req.body
    try {
        const result = await ClientAuthService.signIn(userEmail, password)
        console.log("-----------------result.getAccessToken().getJwtToken()---------------");
        console.log(result.getAccessToken().getJwtToken());
        console.log("---------------------------------------");
        const response = {
            access_token : result.getAccessToken().getJwtToken()
        }
        
        return res.status(200).send(response)
    } catch (error) {
        console.log(error)
        if (error.name === "UserNotConfirmedException") {
            return res.status(400).send({ message: "El usuario fue registrado, pero aun no ha confirmado su cuenta, por favor verifique su casilla de correo (verifique tambien el spam)" } );
        }
        if (error.name === "NotAuthorizedException") {
            return res.status(401).send({ message: "Correo electronico o contraña incorrectos" } );
        }
        return res.status(400).send(error)
    }
})

routes.post('/sign-out', clientLoginValidation, async (req, res) => {
    const { userEmail } = req.body
    const isLogout = await ClientAuthService.signOut(userEmail)
    if (!isLogout) return res.status(400).send({ message: 'El usuario ya se encuentra des conectado' })
    return res.status(200).send({ message: 'Hasta pronto' })
})

module.exports = { routes }