const UserRepository = require('../repositories/user.repository')
const UserDto = require('../common/dtos/UserDto')

class UserService {

    static async getUserByEmail(userEmail) {
        try {
            const result = await UserRepository.readUserByEmail(userEmail)
            if (!result.Item) {
                return null
            }

            const response = new UserDto(                
                result.Item.userEmail['S'],
                result.Item.userSub['S'],
                result.Item.dni['S'],
                result.Item.balance['N'] ? parseFloat(result.Item.balance['N']) : 0,
                result.Item.name['S'],
                result.Item.lastName['S'],
                result.Item.province['S'],
                result.Item.municipality['S'],
                result.Item.city['S'],
                result.Item.postalCode['S'],
                result.Item.emergencyContact['S'],
                result.Item.healthInsurance['S'],
                result.Item.insurancePlan['S'],
            )
            return response
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserService