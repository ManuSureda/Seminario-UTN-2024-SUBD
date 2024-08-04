const { CognitoUserPool } = require('amazon-cognito-identity-js')

const poolData = {
    UserPoolId: process.env.COGNITO_TRANSPORT_USER_POOL_ID, 
    ClientId: process.env.COGNITO_TRANSPORT_APP_CLIENT_ID
}

const transportUserPool = new CognitoUserPool(poolData)

module.exports = transportUserPool