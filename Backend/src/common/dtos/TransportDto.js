class TransportDto {
    transportEmail;
    licensePlate;
    routeNumber;
    routeOptions;

    constructor(
        transportEmail,
        licensePlate,
        routeNumber,
        routeOptions
    ) {
        this.transportEmail = transportEmail
        this.licensePlate = licensePlate
        this.routeNumber = routeNumber
        this.routeOptions = routeOptions ? routeOptions : []
    }
}

module.exports = TransportDto 