require('dotenv').config()// comentar en prod
//viene a ser app.js
const express = require('express')
const bodyParser = require('body-parser') // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors') // package for providing a Connect/Express middleware that can be used to enable CORS with various options.
// controllers - auth
const { routes: clientAuthController    } = require('./controllers/auth/client-auth.controller')
const { routes: transportAuthController } = require('./controllers/auth/transport-auth.controller')
// controllers
const { routes: transportController } = require('./controllers/transport.controller')
const { routes: userController      } = require('./controllers/user.controller')
const { routes: paymentController   } = require('./controllers/payment.controller')
const { routes: travelController    } = require('./controllers/travel.controller')
const { routes: testController      } = require('./controllers/test.controller')

const app = express();
app.use(bodyParser.json());
app.use(cors())// si lo usas asi, estas habilitando todos los origenes, si no queres eso: https://www.npmjs.com/package/cors

// borrar
app.use('/test', testController)

// controllers
app.use('/auth/clients',    clientAuthController)
app.use('/auth/transports', transportAuthController)
app.use('/transports', transportController)
app.use('/users',      userController)
app.use('/payments',   paymentController)
app.use('/travels',    travelController)


// Configura el encabezado de la respuesta para permitir el acceso desde cualquier origen
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
//     if (req.method === 'OPTIONS') {
//       // Si la solicitud es OPTIONS, responde con los encabezados permitidos
//       res.sendStatus(200);
//     } else {
//       // Si la solicitud no es OPTIONS, continúa con el siguiente middleware
//       next();
//     }
// });

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor JSON escuchando en http://localhost:${port}`);
});