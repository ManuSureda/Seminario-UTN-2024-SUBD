export interface ITicketClientData {
  get: "in" | "out";
  payerEmail: string;
  payerSub: string;
  guestDni?: string; // Propiedad opcional
  guestEmail?: string; // Propiedad opcional
}
