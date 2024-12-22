import type { WebAppData } from '../dto/web_app_data'
import { GetTgUser } from '../service/user_service.ts'
import { logger } from '../config/app/logger_config.ts'
import type { User } from '../model/user.ts'
import { AuthHelper } from '../telegram/auth_helper.ts'
import BotConfig from '../config/app/bot_config.ts'
import type { Context } from 'elysia'

const authMiddleware = async (context: Context) => {
    try {
        const body = await context.request.json()
        console.log(body)
        let webData: WebAppData = body as WebAppData
        let valid = AuthHelper.isValid(
            webData.web_app_data.data_check_string,
            BotConfig.botToken,
            webData.web_app_data.hash
        )
        if (!valid) return context.error(401, 'Unauthorized')
        // console.log(valid)
        // let tgUser: User = (await GetTgUser(
        //     webData.web_app_data.user_id,
        //     webData.web_app_data.username
        // ).then((user) => {
        //     return user
        // })) as User
    } catch (error) {
        console.log(error)
        return context.error(401, 'Unauthorized')
    }
}

export default authMiddleware
