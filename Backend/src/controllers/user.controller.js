const express = require('express')
// --- middleware ---
const clientTokenValidation = require('../middleware/token/client-token.validation')
const { clientValidation } = require('../middleware/client.validation')
// --- services ---
const UserService = require('../services/user.service')

const routes = express.Router({
    mergeParams: true
})//permite que los parámetros de ruta definidos en los enrutadores superiores sean accesibles en los enrutadores secundarios.

routes.get('/', clientTokenValidation, clientValidation, async (req, res) => {
    try {
        const { userEmail } = req.query // Captura el parámetro 'userEmail' de la URL
    
        const result = await UserService.getUserByEmail(userEmail)
        console.log("----------------fetch user result------------------------");
        if (result === null) return res.status(404).send({ message: `Usuario no encontrado: ${userEmail}` })
            
        console.log(result);
        delete result.password;
        return res.status(200).send(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

module.exports = { routes }