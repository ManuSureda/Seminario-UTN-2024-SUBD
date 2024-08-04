const { PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const dynamoConfig = require('../common/config/dynamoConfig')
const { dynamoDB } = require('../common/config/dynamoConfig');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');

class UserRepository {
    // para evitar un GSI (dinero) decidi usar un metodo de filtro, mucho menos eficiente, pero gratis
    static async readUserByEmail(email) {
        console.log("UserRepository - readUserByEmail");
        try {
            const params = {
                TableName: 'user',  // Asegúrate de que este es el nombre correcto de tu tabla
                Key: {
                    userEmail: { S: email } // Referencia la variable userEmail
                }
            }
        
            const result = await dynamoDB.send(new GetItemCommand(params)); // Pasa los parámetros al comando
            // console.log("result: ");
            // console.log(result);
            return result
        } catch (error) {
            throw error;
        }
    }

    static async saveUser(user) {
        console.log("UserRepository - saveUser");
        try {
            const params = {
                TableName: dynamoConfig.table_users,
                Item: user
            }

            const data = await dynamoDB.send(new PutCommand(params))            
            // console.log("result");
            // console.log(data);
            return data 
        } catch (error) {
            throw error
        }     
    }

    static async updateBalance(userEmail, amount) {
        console.log("UserRepository - updateBalance");
        console.log("--------------------------------------------------");
        console.log("----------------------ENTRO UserRepository----------------------------");
        console.log("--------------------------------------------------");
        try {
            const params = {
                TableName: dynamoConfig.table_users,
                Key: {
                    userEmail: userEmail
                },
                UpdateExpression: 'set balance = balance + :amount',
                ExpressionAttributeValues: {
                    ':amount': amount
                },
                ReturnValues: 'UPDATED_NEW'
            }
    
            const result = await dynamoDB.send(new UpdateCommand(params))
            if (result.Attributes.length === 0) {
                return null 
            }
            console.log("-------updateBalance----------");
            console.log(result.Attributes);
            return result.Attributes.balance
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}

module.exports = UserRepository