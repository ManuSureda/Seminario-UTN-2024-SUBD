const { mpPreference, mpPayment } = require('../common/config/mercadoPagoConfig')
const UserService = require('./user.service')
const PaymentRepository = require('../repositories/payment.repository')
const UserRepository = require('../repositories/user.repository')

class PaymentService {
    static async deposit(userEmail, amount) {
        console.log("payment.service | deposit");
        try {
            // 1- 
            const user = await UserService.getUserByEmail(userEmail)

            if (user === null) {
                const error = new Error(`No existe ningun usuario con dicho correo: ${ userEmail }`)
                error.code = "UserNotFound"
                console.log(error);
                throw error
            }

            const paymentData = {
                payer: user,
                amount: amount
            }
            const result = await this.createOrder(paymentData)
            // console.log("result.init (payment.service deposit()");
            // console.log(result.init_point);
            // console.log("---------------------------------------");
            return result.init_point
        } catch (error) {
            throw error
        }
    }

    static async createOrder(paymentData) {
        console.log("payment.service | createOrder");
        const { payer, amount } = paymentData
        try {
            const result = await mpPreference.create({
                body: {
                    additional_info: "--- info adicional ---",
                    notification_url: process.env.URL_WEBHOOK_MP,
                    items: [
                        {
                            title: `${payer.userEmail}`,
                            description: `Saldo para tu cuenta de SUBD (${payer.userEmail})`,
                            quantity: 1,
                            currency_id: "ARS",
                            unit_price: amount
                        }
                    ],
                    payer: {
                        name:    payer.name,
                        surname: payer.lastName,
                        email:   payer.userEmail
                    },
                    payment_methods: {
                        // expluido tipo de pago efectivo
                        // y se permiten pagos de 1 sola cuota
                        excluded_payment_types: [
                            { id: "ticket" }
                        ],
                        installments: 1,
                        default_installments: 1,
                    }
                }
            })
            // pseudo bug !!!!!!!!!!!!!!
            // por alguna razon, sin bien al conformar la orden de pago ponemos el payer.email
            // mercado pago solo esta tomando los datos de name y lastName. asi q 
            // voy a tomar el email de description, no deberia ser asi, pero mercado pago 
            // no me muestra la forma correcta

            return result
        } catch (error) {
            throw error
        }
    }

    static async receiveWebhook(paymentId) {
        console.log("payment.service | receiveWebhook");
        try {
            // mpPayment.create()
            const data = await mpPayment.get({ id: paymentId })
            // console.log("payment.service");
            // console.log("receiveWebhook");
            // console.log("data.description: " + data.description);

            // console.log("data.charges_details: " + JSON.stringify(data.charges_details, null, 2))

            // pseudo bug !!!!!!!!!!!!!!
            // por alguna razon, sin bien al conformar la orden de pago ponemos el payer.email
            // mercado pago solo esta tomando los datos de name y lastName. asi q 
            // voy a tomar el email de description, no deberia ser asi, pero mercado pago 
            // no me muestra la forma correcta
            // const desc = data.additional_info.items[0].description
            // const regex = /\(([^)]+)\)/
            // const match = desc.match(regex)
            // console.log("----------------------fin webhook ---------------------");
            // const userEmail = match[1]
            const userEmail = data.description
            const amount = data.transaction_amount

            const paymentData = {
                userEmail: userEmail,
                paymentDate: data.money_release_date,
                amount: amount,
                mpPaymentId: paymentId
            }            
            const paymentResult = await PaymentRepository.savePayment(paymentData)
            // console.log("paymentResult", paymentResult);

            const updateBalanceResult = await UserRepository.updateBalance(userEmail, amount)

            // console.log("paymentResult: " + JSON.stringify(paymentResult, null, 2))
            // console.log("updateBalanceResult: " + JSON.stringify(updateBalanceResult, null, 2))

            return updateBalanceResult
        } catch (error) {
            throw error
        }
    }
}

module.exports = PaymentService