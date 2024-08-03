const { PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoConfig = require('../common/config/dynamoConfig');
const  {dynamoDB} = require('../common/config/dynamoConfig');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');

class TravelRepository {

    static async saveTravel(travelData) {
        console.log("TravelRepository - saveTravel");
        try {
            const params = {
                TableName: dynamoConfig.table_travel,
                Item: travelData
            }

            // console.log("params (travelData) ")
            // console.log(params);

            const data = await dynamoDB.send(new PutCommand(params))            
            // console.log("TravelRepository saveTravel result: ");
            // console.log(data);
            // console.log("-------------------------------------");
            return data 
        } catch (error) {
            console.log("TravelRepository - save travel error:");
            console.log(error);
            throw error
        }     
    }

    static async readTravelByEmail(email) {
        console.log("TravelRepository - readTravelByEmail");
        try {
            const params = {
                TableName: dynamoConfig.table_travel,
                KeyConditionExpression: "userEmail = :userEmail",
                ExpressionAttributeValues: {
                    ":userEmail": { S: email }
                }
            };

            const data = await dynamoDB.send(new QueryCommand(params))
            // console.log("TravelRepository readTravelByEmail result: ");
            // console.log(JSON.stringify(data));
            // console.log("-------------------------------------");
            return data
        } catch (error) {
            // console.log("TravelRepository - read travel by email error:");
            // console.log(error);
            throw error
        }
    }

    static async readTravelByEmailAndDate(email, date) {
        console.log("TravelRepository - readTravelByEmailAndDate");
        try {
            const params = {
                TableName: dynamoConfig.table_travel,
                KeyConditionExpression: "userEmail = :userEmail AND travelDate = :travelDate",
                ExpressionAttributeValues: {
                    ":userEmail": { S: email },
                    ":travelDate": { S: date }
                }
            };

            const data = await dynamoDB.send(new QueryCommand(params))
            // console.log("TravelRepository readTravelByEmailAndDate result: ");
            // console.log(JSON.stringify(data.Items[0]));
            // console.log("-------------------------------------");
            return data.Items[0]
        } catch (error) {
            console.log("TravelRepository - read travel by email and date error:");
            console.log(error);
            throw error
        }
    }

    static async updateGetOut(userEmail, travelDate, outDate, busStopOut) {
        console.log("TravelRepository - updateGetOut");
        try {
            const params = {
                TableName: dynamoConfig.table_travel,
                Key: {
                    userEmail: userEmail,
                    travelDate: travelDate
                },
                UpdateExpression: 'set #busStopOut = :busStopOut, #outDate = :outDate',
                ExpressionAttributeNames: {
                    '#busStopOut': 'busStopOut',
                    '#outDate': 'outDate'
                },
                ExpressionAttributeValues: {
                    ':busStopOut': busStopOut,
                    ':outDate': outDate
                },
                ReturnValues: 'ALL_NEW'
            }
            const result = await dynamoDB.send(new UpdateCommand(params))
            
            // console.log("-------updateGetOut----------\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
            // console.log(result.Attributes);
            // console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n-------updateGetOut----------");
            return result.Attributes
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    // static async updateBalance(userEmail, amount) {
    //     console.log("TravelRepository - updateBalance");
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

module.exports = TravelRepository