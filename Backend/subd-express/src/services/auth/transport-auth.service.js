const { CognitoUserAttribute, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js')
const TransportRepository = require("../../repositories/transport.repository")
const transportUserPool = require('../../common/config/transportCognitoConfig')

class TransportAuthService {

    static async cognitoUserExist(userEmail, password) {
        try {
            // 1º compruebo que no exista ningun usuario con dicho email ya registrado.
            await this.login(userEmail, password)
        } catch (error) {
            if (error.code === "UserNotFoundException") {
                return false
            } else {
                if (error.code === "NotAuthorizedException" || error.code === "UserNotConfirmedException") {
                    return true
                } else {
                    throw error
                }
            }
        }
    }

    static async saveCognitoTransport(licensePlate, transportEmail,password) {
        try {
            let attributeList = []
            attributeList.push(new CognitoUserAttribute({
                Name: 'name',
                Value: licensePlate
            }))
            attributeList.push(new CognitoUserAttribute({
                Name: 'email',
                Value: transportEmail
            }))

            return new Promise((resolve, reject) => {
                transportUserPool.signUp(licensePlate, password, attributeList, null, async (err, result) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(result)
                })
            })
        } catch (error) {
            throw error
        }
    }

    static async signUp(transport) {
        console.log("transport-auth.service | signUp");
        try {
            const dynamoUserExist = await TransportRepository.readByLicensePlate(transport.licensePlate)

            if (dynamoUserExist.Item != undefined) {
                throw {
                    code: "DynamoUserAlreadyExistException",
                    message: `Ya existe un vehiculo con dicha patente: ${transport.licensePlate}`
                }
            } else {
                const cognitoSignUpResult = await this.saveCognitoTransport(transport.licensePlate, transport.transportEmail, transport.password)
                
                // console.log("----------------------------");
                // console.log("cognitoSignUpResult");
                // console.log(cognitoSignUpResult);
                // console.log("----------------------------");
                const dynamoResult = await TransportRepository.save(transport)
                // console.log("----------------------------");
                // console.log("dynamoResult");
                // console.log(dynamoResult);
                // console.log("----------------------------");
                return dynamoResult
            }                
        } catch (error) {
            throw error
        }
    }

    static async confirmAccount(licensePlate, confirmationCode) {
        try {
            const userData = {
                Username: licensePlate,
                Pool: transportUserPool
            }
            const cognitoUser = new CognitoUser(userData)

            return new Promise((resolve, reject) => {
                cognitoUser.confirmRegistration(confirmationCode, true, function (error, result) { 
                    if (error) {
                        return reject(error)
                    }
                    resolve(result)
                })
            })
        } catch (error) {
            throw error
        }
    }

    static async reSendConfirmationCode(licensePlate) {
        try {
            const userData = {
                Username: licensePlate,
                Pool: transportUserPool
            }        
    
            const cognitoUser = new CognitoUser(userData)
            
            return new Promise((resolve, reject) => {
                cognitoUser.resendConfirmationCode(function (error, result) {
                    if (error) { 
                        return reject(error) 
                    }
                    resolve(result)
                })
            })
        } catch (error) {
            throw error
        }
    }

    static async signIn(licensePlate, password) {
        const authenticationDetails = new AuthenticationDetails({
            Username: licensePlate,
            Password: password
        })

        const userData = {
            Username: licensePlate,
            Pool: transportUserPool
        }
        const cognitoUser = new CognitoUser(userData)

        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => resolve(result),
                onFailure: (err) => reject(err)
            })
        })
    }

    static async signOut(licensePlate) {
        const userData = {
            Username: licensePlate,
            Pool: transportUserPool
        }
        const cognitoUser = new CognitoUser(userData)
    
        if (cognitoUser !== null) {
            cognitoUser.signOut()
            return true
        }
        return false
    }
}

module.exports = TransportAuthService