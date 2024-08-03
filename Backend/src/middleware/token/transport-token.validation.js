const { CognitoJwtVerifier } = require('aws-jwt-verify')

const transportTokenValidation = async (req, res, next) => {

    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
        res.status(401).send({
            code: "authorizationHeader",
            message: "No se encontro el token de autenticacion"
        })
    } else {
        const token = authorizationHeader.replace("Bearer ", "")

        const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO_TRANSPORT_USER_POOL_ID,
            tokenUse: "access",
            clientId: process.env.COGNITO_TRANSPORT_APP_CLIENT_ID,
            jwksUri: process.env.COGNITO_TRANSPORT_JWKS
        })

        try {
            const payload = await verifier.verify(token)
            console.log("-------------------------------------payload AAAAAAAAAAAAAAAAAAAAAAAAAAA");
            console.log(payload);
            console.log("-------------------------------------payload AAAAAAAAAAAAAAAAAAAAAAAAAAA");
            next()
        } catch (error) {
            console.log(error);
            if (error.failedAssertion != undefined && error.message.startsWith("Token expired")) {
                return res.status(401).send({ code: "token expired", message: "Token de acceso expirado" })
            }
            return res.status(401).send({ code: "unauthorized", message: "Acceso no autorizado" })
        }
    }
}

module.exports = transportTokenValidation