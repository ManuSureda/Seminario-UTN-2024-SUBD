const express = require('express')
// --- middleware ---
const clientTokenValidation = require('../middleware/token/client-token.validation')
const {paymentValidation} = require('../middleware/payment.validation')
// --- services ---
const PaymentService = require('../services/payment.service')

const routes = express.Router({
    mergeParams: true
})//permite que los parámetros de ruta definidos en los enrutadores superiores sean accesibles en los enrutadores secundarios.

routes.post('/mp/deposit', clientTokenValidation, paymentValidation, async (req, res) => {
    const { userEmail, amount } = req.body
    try {
        const result = await PaymentService.deposit(userEmail, amount)
        console.log("/mp/deposit result");
        console.log(result);
        console.log(typeof result);
        console.log("------------------------------");
        if (result === null) return res.status(404).send({ message: `Usuario no encontrado: ${userEmail}` })
        return res.status(200).send({paymentUrl: result})
    } catch (error) {
        console.log(error)
        const errorResponse = {
            code: error.code || error,
            message: error.message || error
        }
        return res.status(400).send(errorResponse)
    }
})

routes.post('/mp/webhook', async (req, res) => {
    console.log("payment.controller webhook, requ.query");
    console.log(req.query);
    console.log("----------------------------");
    if (req.query.type === "payment") {
        const dataId = req.query["data.id"]
        const result = await PaymentService.receiveWebhook(dataId)
        console.log("devuelta en controller: " +result);
        return res.sendStatus(200)
    }
    return res.sendStatus(200);
})

routes.post('/mp/test', async (req, res) => {
    console.log("payment.controller test, requ.query");
    console.log(req.query);
    console.log("----------------------------");
    console.log(req.body);
    console.log("----------------------------");

    // if (req.query.type === "payment") {
    //     const dataId = req.query["data.id"]
    //     const result = await PaymentService.receiveWebhook(dataId)
    //     console.log("devuelta en controller: " +result);
    //     return res.sendStatus(200)
    // }
    return res.sendStatus(200);
})

module.exports = { routes }