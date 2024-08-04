class UserDto {
    userEmail;
    userSub;
    dni;
    balance;
    name;
    lastName;
    province;
    municipality;
    city;
    postalCode;
    emergencyContact;
    healthInsurance;
    insurancePlan;

    constructor(
        userEmail,userSub,dni,balance,name,lastName,province,municipality,city,postalCode,emergencyContact,healthInsurance,insurancePlan
    ) {
        this.userEmail        = userEmail
        this.userSub          = userSub
        this.dni              = dni
        this.balance          = balance
        this.name             = name
        this.lastName         = lastName
        this.province         = province
        this.municipality     = municipality
        this.city             = city
        this.postalCode       = postalCode
        this.emergencyContact = emergencyContact
        this.healthInsurance  = healthInsurance
        this.insurancePlan    = insurancePlan
    }
}

module.exports = UserDto