import sql from "../config/app/db-config";
import { logger } from "../config/app/logger-config";

const table_name = 'image_user_instance'

class TasksRepository {
    static async getDailyTasksByUserID(tgUserGuid: string) {
        try {
            const tasks = await sql`
            SELECT * FROM ${sql(table_name)}
            WHERE tg_user_guid = ${tgUserGuid};
        `;

            if (tasks.count === 0 || tasks.length === 0) {
                return [];
            } else {
                return tasks;
            }
        } catch (error) {
            logger.error('Ошибка при получении всех экземпляров по tg_user_guid:', error);
            return undefined;
        }
    }

    static async getUsualTasksByUserID(tgUserGuid: string) {
        try {
            const tasks = await sql`
            SELECT * FROM ${sql(table_name)}
            WHERE tg_user_guid = ${tgUserGuid};
        `;

            if (tasks.count === 0 || tasks.length === 0) {
                return [];
            } else {
                return tasks;
            }
        } catch (error) {
            logger.error('Ошибка при получении всех экземпляров по tg_user_guid:', error);
            return undefined;
        }
    }
}

export default TasksRepository
