import type { WebAppData } from '../dto/web-app-data'
import { AuthHelper } from '../telegram/auth-helper.ts'
import BotConfig from '../config/app/bot-config.ts'
import type { Context } from 'elysia'
import { type User } from '../model/user.ts'
import { getTgUser } from '../service/user-service.ts'
import { logger } from '../config/app/logger-config.ts'

const authMiddleware = async (context: Context) => {
    try {
        const body = await context.body
        let webData: WebAppData = body as unknown as WebAppData
        let valid = AuthHelper.isValid(
            webData.web_app_data.data_check_string,
            BotConfig.botToken,
            webData.web_app_data.hash
        )
        logger.debug("Hash: ", valid)
        if (!valid) return context.error(401, 'Unauthorized')
        let userNameValid = validateUserFromDataCheckString(webData.web_app_data.data_check_string,webData.web_app_data.user_id,webData.web_app_data.username);
        if(!userNameValid){
            logger.warn('Not valid username or tgGuid ', webData.web_app_data.user_id)
            return context.error(401, 'Unauthorized')
        }
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
        logger.error(error)
        return context.error(401, 'Unauthorized');
    }
}

export default authMiddleware


function validateUserFromDataCheckString(
    dataCheckString: string,
    userId: string,
    username: string
): boolean {
    try {
        // Ищем строку user и извлекаем JSON
        const userMatch = dataCheckString.match(/user=({.*?})/);
        if (!userMatch || userMatch.length < 2) {
            return false; // Если не найдено, возвращаем false
        }

        // Парсим JSON из строки
        const userObject = JSON.parse(userMatch[1]);
        if (!userObject) {
            return false;
        }

        // Проверяем совпадение user_id и username
        return userObject.id === Number(userId) && userObject.username === username;
    } catch (error) {
        console.error('Ошибка при проверке data_check_string:', error);
        return false;
    }
}