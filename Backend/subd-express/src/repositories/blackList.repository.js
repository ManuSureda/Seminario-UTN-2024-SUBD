const { PutCommand, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoConfig = require('../common/config/dynamoConfig');
const  {dynamoDB} = require('../common/config/dynamoConfig');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');

class BlackListRepository {

    static async save(userEmail) {
        console.log("BlackListRepository - save");
        try {
            const params = {
                TableName: dynamoConfig.table_travel,
                Item: userEmail
            }

            console.log("params (userEmail) ")
            console.log(params);

            const data = await dynamoDB.send(new PutCommand(params))            
            console.log("BlackListRepository save result: ");
            console.log(data);
            console.log("-------------------------------------");
            return data 
        } catch (error) {
            console.log("BlackListRepository - save travel error:");
            console.log(error);
            throw error
        }     
    }

    static async scanList() {
        console.log("BlackListRepository - scanList");
        try {
            const params = {
                TableName: dynamoConfig.table_black_list
            }
            const data = await dynamoDB.send(new ScanCommand(params))
            console.log("BlackListRepository scanList result: ");
            console.log(data);
            console.log("-------------------------------------");
            return data
        } catch (error) {
            console.log("BlackListRepository - scan list error:");
            console.log(error);
            throw error
        }
    }

    static async readByEmail(email) {
        console.log("BlackListRepository - readByEmail");
        try {
            const params = {
                TableName: dynamoConfig.table_black_list,
                KeyConditionExpression: "userEmail = :userEmail",
                ExpressionAttributeValues: {
                    ":userEmail": { S: email }
                }
            };

            const data = await dynamoDB.send(new QueryCommand(params))
            console.log("BlackListRepository - readByEmail result: ");
            console.log(JSON.stringify(data));
            console.log("-------------------------------------");
            return data
        } catch (error) {
            console.log("BlackListRepository - readByEmail error:");
            console.log(error);
            throw error
        }
    }

    // static async updateBalance(userEmail, amount) {
    //     console.log("BlackListRepository - updateBalance");
    //     try {
    //         const params = {
    //             TableName: dynamoConfig.table_users,
    //             Key: {
    //                 userEmail: userEmail
    //             },
    //             UpdateExpression: 'set balance = balance + :amount',
    //             ExpressionAttributeValues: {
    //                 ':amount': amount
    //             },
    //             ReturnValues: 'UPDATED_NEW'
    //         }
    
    //         const result = await dynamoDB.send(new UpdateCommand(params))
    //         if (result.Attributes.length === 0) {
    //             return null 
    //         }
    //         console.log("updateBalance result.Attributes");
    //         console.log(result.Attributes);
    //         console.log("------------------------------");
    //         return result.Attributes.balance
    //     } catch (error) {
    //         console.log(error);
    //         throw error
    //     }
    // }
}

module.exports = BlackListRepository