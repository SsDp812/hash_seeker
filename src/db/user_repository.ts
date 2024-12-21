import type { User } from '../model/user.ts';
import sql from '../config/app/db_config.ts';
import { logger } from '../config/app/logger_config.ts';


const users_table_name = 'tg_bot_users'

export async function SearchByTgGuid(guid: string) {
    try {
        const users = await sql`
            SELECT * FROM ${sql(users_table_name)} WHERE tg_guid = ${guid} LIMIT 1;
        `;
        if(users.count === 0 || users.at(0) == undefined || users.at(0) == null){
            return null;
        }else{
            return users.at(0) as User;
        }
    } catch (error) {
        logger.error('Ошибка при поиске пользователя:', error);
        return undefined;
    }
}

export async function SaveNewUser(tgUser: User) {
    try {
        const id = await sql`
            INSERT INTO ${sql(users_table_name)} (id,tg_username,tg_guid,referal_id,referal_private_code)
            VALUES (default,${tgUser.tg_username},${tgUser.tg_guid},${tgUser.referal_id},${tgUser.referal_private_code})
            RETURNING id;
        `;
        if(id.count == 0 || id.at(0) == undefined || id.at(0) == null){
            return null;
        }else{
          tgUser.id = id.at(0).id as Number;
          return tgUser;
        }
    } catch (error) {
        logger.error('Ошибка при сохранении нового пользователя:', error);
        return undefined;
    }
}

