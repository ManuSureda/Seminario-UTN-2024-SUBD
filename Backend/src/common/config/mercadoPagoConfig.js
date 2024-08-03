//Comprador 2 TESTUSER490870221 pLBMsAev7u


const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')

const config = new MercadoPagoConfig({
    accessToken: process.env.MP_CONFIG_ACCESS_TOKEN
})
const mpPreference = new Preference(config)
const mpPayment = new Payment(config)

module.exports = { mpPreference, mpPayment }