// const TransportRepository = require("../repositories/transport.repository");
const TransportService = require("../services/transport.service");
const TravelRepository = require("../repositories/travel.repository");
const RouteRepository = require("../repositories/route.repository");
const UserService = require("./user.service");
const UserRepository = require("../repositories/user.repository");
const TravelDto = require("../common/dtos/TravelDto");
const https = require('https');


class TravelService {

    static getAddressByLatLon(lat, lon) {
        return new Promise((resolve, reject) => {
            const API_KEY = process.env.GOOGLE_MAPS_API_KEY
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${API_KEY}`;
            console.log("getAddressByLatLon()");
            console.log(`url: ${url}`);

            https.get(url, (resp) => {
                let data = '';

                // Recibir datos en trozos
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // Al final de la respuesta
                resp.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);

                        if (parsedData.status === 'OK') {
                            console.log("-----------------ADDRESS----------------\n\n\n\n\n");
                            // v1
                            // const address_components = parsedData.results[1].address_components
                            // const address = address_components[1].short_name + ' ' + address_components[0].short_name; // calle + altura
                            // v2
                            // const address = parsedData.results[3].formatted_address.split(',')[0].trim();
                            // console.log(address);
                            // v3
                            let address = '';
                            for (const result of parsedData.results) {
                                if (result.types && result.types.includes("street_address")) {
                                    if (result.formatted_address) {
                                        address = result.formatted_address.split(', ')[0]
                                    }
                                }
                            }
                            console.log(address);
                            console.log("\n\n\n\n\n-----------------ADDRESS----------------");

                            resolve(address);
                        } else {
                            reject(new Error(`Error en la API de Google: ${parsedData.status}`));
                        }
                    } catch (err) {
                        reject(err);
                    }
                });

            }).on('error', (err) => {
                console.log("\n .on err:");
                console.log(err);
                reject(err);
            });
        });
    }
    
    static async getIn(paymentData) {
        console.log("payment service: get-in, paymentData");
        // console.log(paymentData);
        // console.log("-----------------------------------------");
        // comprobaciones
        try {
            // verificar usuario pagador
            const user = await UserService.getUserByEmail(paymentData.clientData.payerEmail) // retorna un dto
            if (user === null) {
                const error = new Error(`No existe ningun usuario con dicho correo: ${ paymentData.clientData.payerEmail }`)
                error.code = "UserNotFound"
                console.log(error);
                throw error
            }
            if (user.userSub != paymentData.clientData.payerSub) {
                const error = new Error(`Hay un error en los datos del usuario: ${ paymentData.clientData.payerEmail }, por favor inicie secion nuevamente e intentelo de nuevo`)
                error.code = "UserDataMismatch"
                console.log(error);
                throw error
            }

            // verificar transporte
            const transport = await TransportService.getTransportByLicensePlate(paymentData.transportData.licensePlate)
            if (transport === null) {
                const error = new Error(`No existe ningun transporte con dicha patente: ${ paymentData.transportData.licensePlate }`)
                error.code = "TransportNotFound"
                console.log(error);
                throw error
            }
            if (transport.routeNumber != paymentData.transportData.routeNumber) {
                const error = new Error(`La patente: ${ transport.licensePlate }, no esta a asignada a dicha ruta: ${paymentData.transportData.routeNumber}`)
                error.code = "TransportDataMismatch"
                console.log(error);
                throw error
            }
            
            // verificar ruta y seccion de ruta
            const route = await RouteRepository.readByRouteNumber(paymentData.transportData.routeNumber)
            if (!route.Item) {
                const error = new Error(`No existe ninguna ruta con dicha numero: ${ paymentData.transportData.routeNumber }`)
                error.code = "RouteNotFound"
                console.log(error);
                throw error
            }

            // verificamos la ruta
            const realRouteOptions = route.Item.routeOptions.L;
            const selectedRouteOption = paymentData.transportData.routeOption;
            
            const selectedOption = realRouteOptions.find(option => option.M.name.S === selectedRouteOption)
            if (selectedOption === undefined) {
                const error = new Error(`No existe dicha seccion de ruta: ${ paymentData.transportData.routeOption }`)
                error.code = "RouteOptionNotFound"
                console.log(error);
                throw error
            }
            
            const travelCost = parseFloat(selectedOption.M.cost.N)

            
            // console.log("\n\n\n travel cost \n\n\n");
            // console.log("realRouteOptions: " + realRouteOptions);
            // console.log("selectedRouteOption: " + selectedRouteOption);
            // console.log("selectedOption: " + selectedOption);
            // console.log("travelCost: " + travelCost);
            // console.log("\n\n\n\n\n\n");
            

            if (paymentData.onlinePayment === true) {
                // revizo que tenga el saldo suficiente
                if (user.balance < travelCost) {
                    const error = new Error(`No cuenta con los fondos suficientes para pagar el boleto, costo: ${ travelCost } | fondos: ${ user.balance }`)
                    error.code = "InsufficientBalance"
                    console.log(error);
                    throw error
                }                
            }

            // obtengo la direccion de donde se sube el cliente
            const busStopIn = await this.getAddressByLatLon(paymentData.transportData.gpsLocation.lat, paymentData.transportData.gpsLocation.lon) 
            if (busStopIn == undefined || busStopIn === '') {
                throw new Error("No se pudo obtener la direccion de donde se subio el pasajero")
            }

            console.log("-----travelData-----");
            const travelData = {
                userEmail:    paymentData.clientData.payerEmail,
                travelDate:   paymentData.transportData.ticketDate,
                licensePlate: paymentData.transportData.licensePlate,
                routeNumber:  paymentData.transportData.routeNumber,
                routeOption:  paymentData.transportData.routeOption,
                cost:         travelCost,
                busStopIn:    busStopIn,
                onlinePayment: paymentData.onlinePayment
            }
            if (paymentData.clientData.guestEmail != undefined) {
                travelData.guestEmail = paymentData.clientData.guestEmail
            }
            if (paymentData.clientData.guestDni != undefined) {
                travelData.guestDni = paymentData.clientData.guestDni
            }
            console.log(travelData);

            const result = await TravelRepository.saveTravel(travelData)
            console.log("-----TravelRepository.saveTravel(travelData)-----");
            console.log(result);
            console.log("-------------------------------------------------");

            // console.log("--------------------------------------------------");
            // console.log("----------------------paymentData.onlinePayment----------------------------");
            // console.log(paymentData.onlinePayment);            
            // console.log("--------------------------------------------------");
            // console.log("--------------------------------------------------");
            

            if (paymentData.onlinePayment === true) {
                console.log("--------------------------------------------------");
                console.log("----------------------ENTRO AL IF----------------------------");
                console.log("--------------------------------------------------");
                const newBalance = await UserRepository.updateBalance(travelData.userEmail, (travelData.cost * -1))
                console.log("newBalance: "+ newBalance);             
            }

            // reviso si el guestEmail esta presente, y si ademas es un usuario 
            // registrado en la bd, hago otro saveTravel para que quede en su registro
            // pero sin modificar su balance y aclarando quien fue el que pago.
            if (travelData.guestEmail != undefined) {
                const guestUser = await UserService.getUserByEmail(travelData.guestEmail)
                if (guestUser) {
                    // reemplazo el email del pagador por el del invitado
                    const guestTravelData = { ...travelData }

                    guestTravelData.userEmail = travelData.guestEmail
                    if (guestTravelData.guestDni) {
                        delete guestTravelData.guestDni
                    }
                    delete guestTravelData.guestEmail

                    guestTravelData.payerEmail = travelData.userEmail

                    await TravelRepository.saveTravel(guestTravelData)
                }
            } 

            return result
        } catch (error) {
            throw error
        }
    }

    static async getOut(ticketData) {
        console.log("payment service: get-out, ticketData");
        // console.log(ticketData);
        // console.log("-----------------------------------------");
        
        try {
            const dynamoTravel = await TravelRepository.readTravelByEmailAndDate(ticketData.userEmail, ticketData.travelDate)
            if (dynamoTravel === null) {
                const error = new Error(`Registro no encontrado: ${ ticketData.userEmail } | ${ ticketData.routeNumber } - ${ ticketData.travelDate }`)
                error.code = "TravelNotFound"
                console.log(error);
                throw error
            }

            // obtengo la direccion de donde se baja el cliente
            const busStopOut = await this.getAddressByLatLon(ticketData.outLocation.lat, ticketData.outLocation.lon) 
            if (busStopOut == undefined || busStopOut === '') {
                throw new Error("No se pudo obtener la direccion de donde se bajo el pasajero")
            }
            if (dynamoTravel.routeNumber.S != ticketData.routeNumber) {
                const error = new Error(`Error en el registro: la informacion aportada Linea: ${ticketData.routeNumber}, no coincide con la del registro ${ dynamoTravel.routeNumber.S }`)
                error.code = "DataMissMatch"
                console.log(error);
                throw error
            }
            
            const result = await TravelRepository.updateGetOut(
                ticketData.userEmail,
                ticketData.travelDate,
                ticketData.outDate,
                busStopOut
            )
            
            return result
        } catch (error) {
            throw error
        }
    }

    static async getTravelListByUserEmail(userEmail) {
        console.log(`TravelService: getTravelListByUserEmail(${userEmail})`);
        try {
            // retorna el .Items
            const result = await TravelRepository.readTravelByEmail(userEmail)
            if (!result.Items) {
                return null
            }

            // console.log("\n\n\ngetTravelListByUserEmail\n\n\n");

            let response = []
            result.Items.forEach(element => {
                console.log("-------element--------");
                console.log(element);
                console.log("---------------");
                const data = {
                    userEmail:    element.userEmail.S,
                    travelDate:   element.travelDate.S,
                    licensePlate: element.licensePlate.S,
                    routeNumber:  element.routeNumber.S,
                    routeOption:  element.routeOption.S,
                    cost:         element.cost.N,
                    busStopIn:    element.busStopIn.S,
                    onlinePayment: element.onlinePayment.BOOL,
                    busStopOut:   element.busStopOut ? element.busStopOut.S : undefined,
                    outDate:      element.outDate    ? element.outDate.S    : undefined,
                    guestEmail:   element.guestEmail ? element.guestEmail.S : undefined,
                    guestDni:     element.guestDni   ? element.guestDni.S   : undefined,
                    payerEmail:   element.payerEmail ? element.payerEmail.S : undefined,
                }
                const travel = new TravelDto(data)
                response.push(travel)
            });

            return response
        } catch (error) {
            throw error
        }
    }
}

module.exports = TravelService