export interface IUser {
    userEmail: string;
    userSub: string;
    dni: string;
    balance: number;
    name: string;
    lastName: string;
    province?: string;
    municipality?: string;
    city?: string;
    postalCode?: string;
    emergencyContact?: string;
    healthInsurance?: string;
    insurancePlan?: string;
}
