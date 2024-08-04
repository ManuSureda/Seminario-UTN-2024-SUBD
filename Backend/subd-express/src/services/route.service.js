const RouteOptionDto = require("../common/dtos/RouteOptionDto");
const RouteRepository = require("../repositories/route.repository");


class RouteService {
    static async getRoutesByRouteNumber(routeNumber) {
        console.log(`RouteService - getRoutesByRouteNumber(${routeNumber})`);
        try {
            const routesResponse = await RouteRepository.readByRouteNumber(routeNumber);

            if (!routesResponse.Item) {
                return null
            }

            const response = []
            routesResponse.Item.routeOptions.L.forEach(element => {
                const routeOption = new RouteOptionDto(
                    element.M.name.S,
                    element.M.cost.N
                );
                response.push(routeOption)
            });
            return response;
        } catch (error) {
            throw error
        }
    }
}

module.exports = RouteService