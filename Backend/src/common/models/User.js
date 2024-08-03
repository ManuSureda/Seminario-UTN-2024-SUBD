const joi = require('joi')
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

class User {
    constructor(userEmail, password, balance, name, lastName, province, municipality, city, postalCode, emergencyContact, healthInsurance, insurancePlan) {
        this.userEmail        = userEmail;
        this.password         = password;
        this.balance          = balance;
        this.name             = name;
        this.lastName         = lastName;
        this.province         = province;
        this.municipality     = municipality;
        this.city             = city;
        this.postalCode       = postalCode;
        this.emergencyContact = emergencyContact;
        this.healthInsurance  = healthInsurance;
        this.insurancePlan    = insurancePlan;
    }
}

module.exports = User