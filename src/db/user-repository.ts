import type { User } from '../model/user.ts'
import sql from '../config/app/db-config.ts'
import { logger } from '../config/app/logger-config.ts'
import type { UserInfo } from '../dto/users-top-info.ts'

const users_table_name = 'tg_bot_users'

export async function searchByTgGuid(guid: string) {
    try {
        const users = await sql`
            SELECT * FROM ${sql(users_table_name)} WHERE tg_guid = ${guid} LIMIT 1;
        `
        if (
            users.count === 0 ||
            users.at(0) == undefined ||
            users.at(0) == null
        ) {
            return null
        } else {
            return users.at(0) as User
        }
    } catch (error) {
        logger.error('Ошибка при поиске пользователя:', error)
        return undefined
    }
}

export async function saveNewUser(tgUser: User) {
    try {
        const id = await sql`
            INSERT INTO ${sql(users_table_name)} (id,tg_username,tg_guid,referal_id,referal_private_code)
            VALUES (default,${tgUser.tg_username},${tgUser.tg_guid},${tgUser.referal_id},${tgUser.referal_private_code})
            RETURNING id;
        `
        if (id.count == 0 || id.at(0) == undefined || id.at(0) == null) {
            return null
        } else {
            tgUser.id = id.at(0).id as number
            return tgUser
        }
    } catch (error) {
        logger.error('Ошибка при сохранении нового пользователя:', error)
        return undefined
    }
}

export async function getTotalUsers() : Promise<number | null> {
    try {
        const users = await sql`
            SELECT count(*) as all_count FROM ${sql(users_table_name)};
        `
        if (
            users.count === 0 ||
            users.at(0) == undefined ||
            users.at(0) == null
        ) {
            return null
        } else {
            return users.at(0).all_count as unknown as number
        }
    } catch (error) {
        logger.error('Ошибка при поиске пользователя:', error)
        return undefined
    }
}

export async function getTopUsersByBalance(limit: number): Promise<UserInfo[] | null> {
    try {
        const result = await sql`
            SELECT 
                tgu.tg_username as username,
                uwti.coins_amount as balance,
                RANK() OVER (ORDER BY uwti.coins_amount DESC, tgu.id ASC) as top,
                ii.image_name as userImageName
            FROM 
                user_wallets_tg_info uwti
            JOIN 
                tg_bot_users tgu
                ON uwti.tg_user_id = tgu.id
            LEFT JOIN 
                image_user_instance iui
                ON iui.tg_user_id = tgu.id AND iui.active_status = true
            LEFT JOIN 
                image_info ii
                ON iui.image_id = ii.id
            ORDER BY 
                uwti.coins_amount DESC, tgu.id ASC
            LIMIT ${limit};
        `;

        if (result.count === 0) {
            return [];
        }

        return result.map((row, index) => ({
            username: row.username,
            balance: Number(row.balance),
            top: row.top || index + 1,
            userImageName: row.userimagename || 'default.png',
        }));
    } catch (error) {
        console.error('Ошибка при получении топа пользователей по балансу:', error);
        return null;
    }
}