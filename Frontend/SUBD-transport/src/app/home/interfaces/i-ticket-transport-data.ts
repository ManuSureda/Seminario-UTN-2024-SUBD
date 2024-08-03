/**
 * @param licensePlate: string;
 * @param ticketDate: string;
 * @param gpsLocation: {lat: string, lon: string};
 * @param routeNumber: string;
 * @param routeOption: string;
 */
export interface ITicketTransportData {
    licensePlate: string;
    ticketDate: string; // year/month/dayThours:minuts:seconds
    gpsLocation: {
        lat: string;
        lon: string;
    };
    routeNumber: string;
    routeOption: string;
}

export function instanceOfITicketTransportData(object: any): object is ITicketTransportData {
    return 'licensePlate' in object && typeof object.licensePlate === 'string' &&
        'ticketDate' in object && typeof object.ticketDate === 'string' &&
        'gpsLocation' in object && typeof object.gpsLocation === 'object' && typeof object.gpsLocation.lat === 'string' && typeof object.gpsLocation.lon === 'string' &&
        'routeNumber' in object && typeof object.routeNumber === 'string' &&
        'routeOption' in object && typeof object.routeOption === 'string';
}