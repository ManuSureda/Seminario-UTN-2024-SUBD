const TransportDto = require('../common/dtos/TransportDto')
const TransportRepository = require('../repositories/transport.repository')

class TransportService {

    static async getTransportByLicensePlate(licensePlate) {
        try {
            const result = await TransportRepository.readByLicensePlate(licensePlate)
            if (!result.Item) {
                return null
            }
            
            const response = new TransportDto(                
                result.Item.transportEmail['S'],
                result.Item.licensePlate['S'],
                result.Item.routeNumber['S'],
            )
            // console.log("---------------------");
            // console.log("transportAuth.service - getTransportByLicensePlate - response");
            // console.log(response);
            // console.log("----------------------");
            return response
        } catch (error) {
            throw error
        }
    }

    // static async modifyTransport(updatedTransportData) {
    //     if (updatedTransportData.travelCost === undefined) {
    //         try {
    //             return await TransportRepository.updateTransportRouteNumber(
    //                 updatedTransportData.licensePlate,
    //                 updatedTransportData.routeNumber
    //             ) // retorna false si no existe dicha licensePlate       
    //         } catch (error) {
    //             throw error
    //         }
    //     } else if (updatedTransportData.routeNumber === undefined) {
    //         try {
    //             return await TransportRepository.updateTransportTravelCost(
    //                 updatedTransportData.licensePlate,
    //                 updatedTransportData.travelCost
    //             ) // retorna false si no existe dicha licensePlate       
    //         } catch (error) {
    //             throw error
    //         }
    //     } else {
    //         try {
    //             return await TransportRepository.updateTransportRouteNumberAndTravelCost(
    //                 updatedTransportData.licensePlate,
    //                 updatedTransportData.routeNumber,
    //                 updatedTransportData.travelCost
    //             ) // retorna false si no existe dicha licensePlate
    //         } catch (error) {
    //             throw error
    //         }
    //     }
    // }

    static async updateTransport(licensePlate, routeNumber) {
        try {
            const result = await TransportRepository.readByLicensePlate(licensePlate)
            if (!result.Item) {
                return null
            }
            
            const response = new TransportDto(                
                result.Item.transportEmail['S'],
                result.Item.licensePlate['S'],
                routeNumber
            )
            
            const updateResult = await TransportRepository.updateTransportRouteNumber(
                licensePlate,
                routeNumber
            ) 
            if (updateResult) {
                return response
            } else {
                return null
            }

        } catch (error) {
            throw error
        }
    }
}

module.exports = TransportService