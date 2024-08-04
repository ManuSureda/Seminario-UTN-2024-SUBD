class TravelDto {
    userEmail;
    travelDate;
    licensePlate;
    routeNumber;
    routeOption;
    cost;
    busStopIn;
    onlinePayment;
    busStopOut;
    outDate;
    guestEmail;
    guestDni;
    payerEmail;

    constructor(data) {
        this.userEmail     = data.userEmail
        this.travelDate    = data.travelDate
        this.licensePlate  = data.licensePlate
        this.routeNumber   = data.routeNumber
        this.routeOption   = data.routeOption
        this.cost          = data.cost
        this.busStopIn     = data.busStopIn
        this.onlinePayment = data.onlinePayment
        this.busStopOut    = data.busStopOut || undefined
        this.outDate       = data.outDate    || undefined
        this.guestEmail    = data.guestEmail || undefined
        this.guestDni      = data.guestDni   || undefined
        this.payerEmail    = data.payerEmail || undefined
    }
}

module.exports = TravelDto