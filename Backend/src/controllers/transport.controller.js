const express = require('express')
// --- middleware ---
const transportTokenValidation = require('../middleware/token/transport-token.validation')
const { transportValidation } = require('../middleware/transport.validation')
// --- services ---
const TransportService = require('../services/transport.service')
const RouteService = require('../services/route.service')
const TransportDto = require('../common/dtos/TransportDto')

const routes = express.Router({
    mergeParams: true
})//permite que los parámetros de ruta definidos en los enrutadores superiores sean accesibles en los enrutadores secundarios.

routes.get('/', transportTokenValidation, transportValidation, async (req, res) => {
    console.log("entro en /");
    try {
        const { licensePlate } = req.query // Captura el parámetro 'userEmail' de la URL
    
        const transportData = await TransportService.getTransportByLicensePlate(licensePlate)
        console.log("transport.controller get / transportData");
        console.log(transportData);
        console.log("-----------------");
        if (transportData === null) return res.status(404).send({ message: `Transporte no encontrado: ${licensePlate}` })

            
        const routesData = await RouteService.getRoutesByRouteNumber(transportData.routeNumber)
        console.log("transport.controller get / routesData");
        console.log(routesData);
        console.log("-----------------");
        if (routesData === null) return res.status(404).send({ message: `No se pudo encontrar la ruta: ${transportData.routeNumber} asignada al transporte: ${licensePlate}, intente iniciar secion nuevamente` })
        
        transportData.routeOptions = routesData
    
        return res.status(200).send(transportData)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

routes.put('/update', transportTokenValidation, transportValidation, async (req, res) => {
    try {
        const { licensePlate, routeNumber } = req.body // Captura el parámetro 'userEmail' de la URL

        const transport = await TransportService.updateTransport(licensePlate, routeNumber)
        if (transport === null) return res.status(404).send({ message: `Transporte no encontrado: ${licensePlate}` })

        return res.status(200).send(transport)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

module.exports = { routes }