export interface ITravel {
    userEmail: string;
    travelDate: string;
    licensePlate: string;
    routeNumber: string;
    routeOption: string;
    cost: number;
    busStopIn: string;
    onlinePayment: boolean;
    busStopOut: string | undefined;
    outDate:    string | undefined;
    guestEmail?: string | undefined;
    guestDni?: string   | undefined;
    payerEmail?: string | undefined;
}
