const express = require('express')
// --- middleware ---
const transportTokenValidation = require('../middleware/token/transport-token.validation')
const {travelValidation} = require('../middleware/travel.validation')
// --- services ---
const TravelService = require('../services/travel.service')

const routes = express.Router({
    mergeParams: true
})//permite que los parámetros de ruta definidos en los enrutadores superiores sean accesibles en los enrutadores secundarios.

routes.get('/', async (req, res) => {
    try {
        const { userEmail } = req.query // Captura el parámetro 'userEmail' de la URL
    
        const result = await TravelService.getTravelListByUserEmail(userEmail)
        // console.log("----------------fetch travel result------------------------");
        // console.log(result);
    
        if (result === null) return res.status(404).send({ message: `Usuario no encontrado: ${userEmail}` })
        return res.status(200).send(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

routes.post('/get-in', transportTokenValidation, travelValidation, async (req, res) => {
    console.log("travel.controller.js POST /get-in");
    const paymentData = req.body
    try {
        const result = await TravelService.getIn(paymentData)
        
        if (result === null) return res.status(404).send({ message: `Transporte no encontrado: ${paymentData.clientData.licensePlate}` })
        return res.status(200).send({message: "viaje cargado con exito, que lo disfrute :)"})
    } catch (error) {
        console.log("catch controller: ");
        console.log(error)
        const errorResponse = {
            code: error.code || error,
            message: error.message || error
        }
        return res.status(400).send(errorResponse)
    }
})

routes.post('/get-out', transportTokenValidation, travelValidation, async (req, res) => {
    console.log("travel.controller.js POST /get-out");
    const ticketData = req.body
    try {
        const result = await TravelService.getOut(ticketData)
        
        if (result === null) return res.status(404).send({ message: `Registro no encontrado` })
        return res.status(200).send({message: "Descenso registrado con exito :)"})
    } catch (error) {
        console.log("catch controller: ");
        console.log(error)
        const errorResponse = {
            code: error.code || error,
            message: error.message || error
        }
        return res.status(400).send(errorResponse)
    }
})

module.exports = { routes }