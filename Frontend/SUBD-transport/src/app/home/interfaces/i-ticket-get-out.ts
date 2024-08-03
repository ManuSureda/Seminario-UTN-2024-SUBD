/**
 * @param userEmail: string, either payerEmail or guestEmail
 * @param travelDate: string, format YYYY-MM-DDThh:mm:ss get-in date
 * @param outDate: string, format YYYY-MM-DDThh:mm:ss get-out date
 * @param outLocation: { lat: string; lon: string; }, get-out gps location
 */
export interface ITicketGetOut {
    userEmail: string;
    travelDate: string;
    routeNumber: string;
    outDate: string;
    outLocation: {
        lat: string;
        lon: string;
    };
}

export function instanceOfITicketGetOut(object: any): object is ITicketGetOut {
    return 'userEmail' in object &&
        typeof object.userEmail === 'string' &&
        'travelDate' in object &&
        typeof object.travelDate === 'string' &&
        'routeNumber' in object &&
        typeof object.routeNumber === 'string' &&
        'outDate' in object &&
        typeof object.outDate === 'string' &&
        'outLocation' in object &&
        typeof object.outLocation === 'object' &&
        object.outLocation !== null &&
        'lat' in object.outLocation &&
        typeof object.outLocation.lat === 'string' &&
        'lon' in object.outLocation &&
        typeof object.outLocation.lon === 'string';
}