const { CognitoUserAttribute, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js')
const userPool = require('../../common/config/cognitoConfig')
const UserRepository = require('../../repositories/user.repository')


class ClientAuthService {
    static async signIn(userEmail, password) {
        const authenticationDetails = new AuthenticationDetails({
            Username: userEmail,
            Password: password
        })

        const userData = {
            Username: userEmail,
            Pool: userPool
        }
        const cognitoUser = new CognitoUser(userData)

        // return new Promise((resolve, reject) => {
        //     cognitoUser.authenticateUser(authenticationDetails, {
        //         onSuccess: (result) => {
        //             console.log("---result---");
        //             console.log(result);
        //             console.log("-------------");

        //             const { accessToken, idToken, refreshToken } = result
        //             cognitoUser.setSignInUserSession(new CognitoUserSession({
        //                 IdToken: idToken,
        //                 AccessToken: accessToken,
        //                 RefreshToken: refreshToken
        //             }))
        //             resolve (result)
        //         },
        //         onFailure: (err) => reject(err)
        //     })
        // })
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => resolve(result),
                onFailure: (err) => reject(err)
            })
        })
    }

    static async cognitoUserExist(userEmail, password) {
        try {
            // 1º compruebo que no exista ningun usuario con dicho email ya registrado.
            return await this.signIn(userEmail, password)
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

    static async saveCognitoUser(userEmail, password) {
        try {
            let attributeList = []
            attributeList.push(new CognitoUserAttribute({
                Name: 'email',
                Value: userEmail
            }))

            return new Promise((resolve, reject) => {
                userPool.signUp(userEmail, password, attributeList, null, async (err, result) => {
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

    static async signUp(newUser) {
        try {
            // 1º compruebo que no exista ningun usuario con dicho email ya registrado.
            const cognitoUserExist = await this.cognitoUserExist(newUser.userEmail, newUser.password)
            if (cognitoUserExist) {  
                throw {
                    code: "CognitoUserAlreadyExistException",
                    message: `Ya existe un usuario con dicho correo: ${newUser.userEmail}`
                }
            } else {
                // 2º verificamos si ya existe en dynamo, no deberia.
                const dynamoUserExist = await UserRepository.readUserByEmail(newUser.userEmail)
                
                // 3º si no existe, primero lo registramos en cognito, y luego en la dynamodb junto con su id (generado por cognito)
                if (dynamoUserExist.Item == undefined) {
                    const cognitoSignUpResult = await this.saveCognitoUser(newUser.userEmail, newUser.password)
                    // guardamos la id generada por cognito
                    newUser.userSub = cognitoSignUpResult.userSub
                    newUser.balance = 0

                    return await UserRepository.saveUser(newUser)
                    //console.log(dynamodbResponse)
                    // if (dynamodbResponse) {
                    //     return dynamodbResponse
                    // }
                } else {
                    throw {
                        code: "DynamoUserAlreadyExistException",
                        message: `Ya existe un usuario con dicho correo: ${newUser.userEmail}`
                    }
                }
            }
        } catch (error) {
            throw error
        }
    }

    static async confirmAccount(userEmail, confirmationCode) {
        try {
            const userData = {
                Username: userEmail,
                Pool: userPool
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

    static async reSendConfirmationCode(userEmail) {
        try {
            const userData = {
                Username: userEmail,
                Pool: userPool
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

    static async signOut(userEmail) {
        const userData = {
            Username: userEmail,
            Pool: userPool
        }
        const cognitoUser = new CognitoUser(userData)
    
        if (cognitoUser !== null) {
            cognitoUser.signOut()
            return true
        }
        return false
    }
}

module.exports = ClientAuthService