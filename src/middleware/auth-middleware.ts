import type { WebAppData } from '../dto/web-app-data'
import { AuthHelper } from '../telegram/auth-helper.ts'
import BotConfig from '../config/app/bot-config.ts'
import type { Context } from 'elysia'
import { type User } from '../model/user.ts'
import { getTgUser } from '../service/user-service.ts'
import { logger } from '../config/app/logger-config.ts'

const authMiddleware = async (context: Context) => {
    try {
        const body = await context.request.json()
        let webData: WebAppData = body as WebAppData
        let valid = AuthHelper.isValid(
            webData.web_app_data.data_check_string,
            BotConfig.botToken,
            webData.web_app_data.hash
        )
        if (!valid) return context.error(401, 'Unauthorized')
        if(BotConfig.botAuthLimit){
            if((((Date.now() as number) - (webData.web_app_data.auth_date as unknown as number) *1000) / 1000) > BotConfig.botAuthTime){
                return context.error(401, 'Unauthorized')
            }
        }
         let tgUser: User = (await getTgUser(
             webData.web_app_data.user_id,
             webData.web_app_data.username
         ).then((user) => {
             return user
         })) as User;
    } catch (error) {
        logger.error
        return context.error(401, 'Unauthorized');
    }
}

export default authMiddleware
