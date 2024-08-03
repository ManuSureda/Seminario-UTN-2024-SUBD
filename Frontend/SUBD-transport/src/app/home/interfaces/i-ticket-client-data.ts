export interface ITicketClientData {
    get: "in" | "out";
    payerEmail: string;
    payerSub: string;
    guestDni?: string;    // Propiedad opcional
    guestEmail?: string;  // Propiedad opcional
}

export function instanceOfITicketClientData(object: any): object is ITicketClientData {
    return 'get' in object &&
        (object.get === "in" || object.get === "out") &&
        'payerEmail' in object &&
        typeof object.payerEmail === 'string' &&
        'payerSub' in object &&
        typeof object.payerSub === 'string' &&
        (object.guestDni === undefined || typeof object.guestDni === 'string') &&
        (object.guestEmail === undefined || typeof object.guestEmail === 'string');
}