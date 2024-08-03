const { PutCommand } = require('@aws-sdk/lib-dynamodb')

const dynamoConfig = require('../common/config/dynamoConfig')
const { dynamoDB } = require('../common/config/dynamoConfig')
const { GetItemCommand } = require('@aws-sdk/client-dynamodb')


class PaymentRepository {
    static async savePayment(newPayment) {
        console.log("PaymentRepository - savePayment");
        
        // Verificar que las claves primarias estén presentes y sean del tipo correcto
        if (!newPayment.userEmail || typeof newPayment.userEmail !== 'string') {
            throw new Error('userEmail is required and should be a string');
        }
        if (!newPayment.paymentDate || typeof newPayment.paymentDate !== 'string') {
            throw new Error('paymentDate is required and should be a string');
        }
        
        try {
            const params = {
                TableName: dynamoConfig.table_payment,
                Item: newPayment
            }

            const data = await dynamoDB.send(new PutCommand(params))
            // console.log("resultado savePayment");
            // console.log(data);
            // console.log("---------------------");
            return data 
        } catch (error) {
            throw error
        }
    }
}

module.exports = PaymentRepository