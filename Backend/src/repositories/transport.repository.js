
const { PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const dynamoConfig = require('../common/config/dynamoConfig');
const { dynamoDB } = require('../common/config/dynamoConfig');

class TransportRepository {
    static async save(transport) {
        console.log("TransportRepository - save");
        try {
            const params = {
                TableName: dynamoConfig.table_transport, // Asegúrate de que este es el nombre correcto de tu tabla
                Item: transport
            }

            const response = await dynamoDB.send(new PutCommand(params))
            // console.log("save transport data");
            // console.log(response);
            return response
        } catch (error) {
            throw error
        }
    }

    static async readByLicensePlate(licensePlate) {
        console.log("TransportRepository - readByLicensePlate");
        try {
            const params = {
                TableName: dynamoConfig.table_transport,
                Key: {
                    licensePlate: { S: licensePlate }
                }
            }

            const response = await dynamoDB.send(new GetItemCommand(params))
            // console.log("TransportRepository readByLicensePlate " + licensePlate + " result:");
            // console.log(response);
            // console.log("-----------------------------------------------------------------------------");
            return response
        } catch (error) {
            throw error
        }
    }

    static async updateTransportRouteNumberAndTravelCost(licensePlate, routeNumber, travelCost) {
        console.log("TransportRepository - updateTransport");
        try {
            const params = {
                TableName: dynamoConfig.table_transport,
                Key: {
                    licensePlate: licensePlate
                },
                UpdateExpression: 'set routeNumber = :routeNumber, travelCost = :travelCost',
                ExpressionAttributeValues: {
                    ':routeNumber': routeNumber,
                    ':travelCost': travelCost
                },
                ReturnValues: 'UPDATED_NEW'
            }
    
            const result = await dynamoDB.send(new UpdateCommand(params))
            if (result.Attributes.length === 0) {
                return null 
            }
            // console.log("-------updateTransportRouteNumberAndTravelCost----------");
            // console.log(result.Attributes);
            return true
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    static async updateTransportRouteNumber(licensePlate, routeNumber) {
        console.log("TransportRepository - updateTransport");
        try {
            const params = {
                TableName: dynamoConfig.table_transport,
                Key: {
                    licensePlate: licensePlate
                },
                UpdateExpression: 'set routeNumber = :routeNumber',
                ExpressionAttributeValues: {
                    ':routeNumber': routeNumber
                },
                ReturnValues: 'UPDATED_NEW'
            }
    
            const result = await dynamoDB.send(new UpdateCommand(params))
            if (result.Attributes.length === 0) {
                return false 
            }
            // console.log("-------updateTransportRouteNumber----------");
            // console.log(result.Attributes);
            return true
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    static async updateTransportTravelCost(licensePlate, travelCost) {
        console.log("TransportRepository - updateTransport");
        try {
            const params = {
                TableName: dynamoConfig.table_transport,
                Key: {
                    licensePlate: licensePlate
                },
                UpdateExpression: 'set travelCost = :travelCost',
                ExpressionAttributeValues: {
                    ':travelCost': travelCost
                },
                ReturnValues: 'UPDATED_NEW'
            }
    
            const result = await dynamoDB.send(new UpdateCommand(params))
            if (result.Attributes.length === 0) {
                return null 
            }
            // console.log("-------updateTransportTravelCost----------");
            // console.log(result.Attributes);
            return true
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}

module.exports = TransportRepository