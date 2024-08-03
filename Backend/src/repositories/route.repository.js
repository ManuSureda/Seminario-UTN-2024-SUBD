
const { PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const dynamoConfig = require('../common/config/dynamoConfig');
const { dynamoDB } = require('../common/config/dynamoConfig');

class RouteRepository {
    static async save(route) {
        console.log("RouteRepository - save");
        try {
            const params = {
                TableName: dynamoConfig.table_route,
                Item: route
            }

            const response = await dynamoDB.send(new PutCommand(params))
            // console.log("save route data");
            // console.log(response);
            return response
        } catch (error) {
            throw error
        }
    }

    static async readByRouteNumber(routeNumber) {
        console.log(`RouteRepository - readByRouteNumber(${routeNumber})`);
        try {
            const params = {
                TableName: dynamoConfig.table_route,
                Key: {
                    routeNumber: { S: routeNumber }
                }
            }

            const response = await dynamoDB.send(new GetItemCommand(params))
            // console.log("RouteRepository readByRouteNumber " + routeNumber + " result:");
            // console.log(response);
            // console.log("-----------------------------------------------------------------------------");
            return response
        } catch (error) {
            throw error
        }
    }

    // static async updateTransportRouteNumberAndTravelCost(licensePlate, routeNumber, travelCost) {
    //     console.log("RouteRepository - updateTransport");
    //     try {
    //         const params = {
    //             TableName: dynamoConfig.table_route,
    //             Key: {
    //                 licensePlate: licensePlate
    //             },
    //             UpdateExpression: 'set routeNumber = :routeNumber, travelCost = :travelCost',
    //             ExpressionAttributeValues: {
    //                 ':routeNumber': routeNumber,
    //                 ':travelCost': travelCost
    //             },
    //             ReturnValues: 'UPDATED_NEW'
    //         }
    
    //         const result = await dynamoDB.send(new UpdateCommand(params))
    //         if (result.Attributes.length === 0) {
    //             return null 
    //         }
    //         console.log("-------updateTransportRouteNumberAndTravelCost----------");
    //         console.log(result.Attributes);
    //         return true
    //     } catch (error) {
    //         console.log(error);
    //         throw error
    //     }
    // }

    // static async updateTransportRouteNumber(licensePlate, routeNumber) {
    //     console.log("RouteRepository - updateTransport");
    //     try {
    //         const params = {
    //             TableName: dynamoConfig.table_route,
    //             Key: {
    //                 licensePlate: licensePlate
    //             },
    //             UpdateExpression: 'set routeNumber = :routeNumber',
    //             ExpressionAttributeValues: {
    //                 ':routeNumber': routeNumber
    //             },
    //             ReturnValues: 'UPDATED_NEW'
    //         }
    
    //         const result = await dynamoDB.send(new UpdateCommand(params))
    //         if (result.Attributes.length === 0) {
    //             return false 
    //         }
    //         console.log("-------updateTransportRouteNumber----------");
    //         console.log(result.Attributes);
    //         return true
    //     } catch (error) {
    //         console.log(error);
    //         throw error
    //     }
    // }

    // static async updateTransportTravelCost(licensePlate, travelCost) {
    //     console.log("RouteRepository - updateTransport");
    //     try {
    //         const params = {
    //             TableName: dynamoConfig.table_route,
    //             Key: {
    //                 licensePlate: licensePlate
    //             },
    //             UpdateExpression: 'set travelCost = :travelCost',
    //             ExpressionAttributeValues: {
    //                 ':travelCost': travelCost
    //             },
    //             ReturnValues: 'UPDATED_NEW'
    //         }
    
    //         const result = await dynamoDB.send(new UpdateCommand(params))
    //         if (result.Attributes.length === 0) {
    //             return null 
    //         }
    //         console.log("-------updateTransportTravelCost----------");
    //         console.log(result.Attributes);
    //         return true
    //     } catch (error) {
    //         console.log(error);
    //         throw error
    //     }
    // }
}

module.exports = RouteRepository