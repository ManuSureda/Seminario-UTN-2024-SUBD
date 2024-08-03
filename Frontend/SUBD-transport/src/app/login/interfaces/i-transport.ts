import { IRouteOption } from "./i-route-option";

export interface ITransport {
    transportEmail: string;
    licensePlate: string;
    routeNumber: string;
    routeOptions: [IRouteOption];
}
