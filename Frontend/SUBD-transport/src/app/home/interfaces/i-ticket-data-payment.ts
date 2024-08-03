import { ITicketClientData } from "./i-ticket-client-data";
import { ITicketTransportData } from "./i-ticket-transport-data";

/**
 * @param transportData: ITicketTransportData
 * @param clientData:    ITicketClientData
 * @param onlinePayment: boolean
 * 
 * used for get-in operations
 */
export interface ITicketDataPayment {
    transportData: ITicketTransportData;
    clientData: ITicketClientData;
    onlinePayment: boolean;
}