import { instanceOfITicketClientData, ITicketClientData } from "./i-ticket-client-data"
import { instanceOfITicketGetOut, ITicketGetOut } from "./i-ticket-get-out"
import { instanceOfITicketTransportData, ITicketTransportData } from './i-ticket-transport-data';

/**
 * represents the data that will be stored in the Ionic Storage
 * when any client performs either a get-in or get-out operation
 * 
 * @param isOnline: boolean, represents if the app has been able to send the get-in information to the server 
 * @param onlinePayment: boolean (true = mp | false = cash),
 * @param transportData: ITicketTransportData,
 * @param clientData: ITicketClientData,
 * @param getOutData?: ITicketGetOut
 */
export interface ILocalStorageTicket {
    isOnline: boolean,
    onlinePayment: boolean,
    transportData: ITicketTransportData,
    clientData: ITicketClientData,
    getOutData?: ITicketGetOut
}

export function instanceOfLocalStorageTicket(object: any): object is ILocalStorageTicket {
    return 'isOnline' in object && 
        'onlinePayment' in object && 
        'transportData' in object && instanceOfITicketTransportData(object.transportData) &&
        'clientData' in object && instanceOfITicketClientData(object.clientData) &&
        (object.getOutData === undefined || instanceOfITicketGetOut(object.getOutData));
}