const { CognitoJwtVerifier } = require('aws-jwt-verify')

const clientTokenValidation = async (req, res, next) => {
    // console.log("tokenvalidation");
    // console.log(req.headers);
    // resultado:
    // tokenvalidation
    // {
    // ...
    // accept: 'application/json, text/plain, */*',
    // authorization: 'Bearer .....',
    // }

    // const authorizationHeader = req.headers.Authorization
    // por mas que en angular pongamos Authorization, express lo recive como authorization
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
        res.status(401).send({
            code: "authorizationHeader",
            message: "No se encontro el token de autenticacion"
        })
    } else {
        const token = authorizationHeader.replace("Bearer ", "")

        const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO_USER_POOL_ID,
            tokenUse: "access",
            clientId: process.env.COGNITO_APP_CLIENT_ID,
            jwksUri: process.env.COGNITO_JWKS
        })

        try {
            const payload = await verifier.verify(token)
            next()

            // console.log("--------------payload------------------");
            // console.log(payload);
            // console.log("----------------cognitoUser----------------");


            // const userData = {
            //     Username: payload.username,
            //     Pool: userPool
            // }
            // const cognitoUser = new CognitoUser(userData)
            // console.log(cognitoUser);
            // console.log("--------------------------------");
            // cognitoUser.getUserAttributes((err, result) => {
            //     if (err) {
            //         console.log(err)
            //         if (err.message === 'User is not authenticated') {
            //             return res.status(401).send({ code: "unauthenticated", message: "Usuario no registrado" })
            //         }
            //         return res.status(401).send({ code: "unauthorized", message: "Acceso no autorizado" })
            //     }
            //     for (i = 0; i < result.length; i++) {
            //         console.log(
            //             'attribute ' + result[i].getName() + ' has value ' + result[i].getValue()
            //         );
            //     }
            // })

            // next()

            // const cognitoUser = new CognitoUser({
            //     Username: payload.username,
            //     Pool: userPool
            // });

            // cognitoUser.getSession((err, session) => {
            //     if (err || !session.isValid()) {
            //         console.log(err)
            //         return res.status(401).send({ code: "unauthorized", message: "Acceso no autorizado" })
            //     } else {
            //         req.user = {
            //             email: payload.email
            //         }
            //         next()
            //     }
            // })
        } catch (error) {
            console.log(error);
            if (error.failedAssertion != undefined && error.message.startsWith("Token expired")) {
                return res.status(401).send({ code: "token expired", message: "Token de acceso expirado" })
            }
            return res.status(401).send({ code: "unauthorized", message: "Acceso no autorizado" })
        }
    }
}

module.exports = clientTokenValidation