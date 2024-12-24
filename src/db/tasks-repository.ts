import sql from "../config/app/db-config";
import { logger } from "../config/app/logger-config";
import type { Task, TaskInfo } from "../model/task";
import type { TaskInstance } from "../model/task-instance";

const tasks = 'tasks'
const tasks_info = 'task_info'
const tasks_instances = 'task_instances'


export async function getLatestTaskInstance(userTgGuid: string, appLanguage: string) {
    try {
        const tasksResult = await sql`
            SELECT
                t.id as task_id,
                ti.date_completed as date_completed,
                tf.title as task_title,
                tf.task_description as task_description,
                tf.app_language as app_language,
                t.link as link,
                t.energy_reward as energy_reward,
                t.is_daily as isDaily,
                t.task_type as task_type
            FROM
                ${sql(tasks)} t
            LEFT JOIN
                ${sql(tasks_instances)} ti
                ON t.id = ti.task_id
            LEFT JOIN
                ${sql(tasks_info)} tf
                ON t.id = tf.task_id AND tf.app_language = ${appLanguage}
            WHERE
                (ti.user_tg_guid = ${userTgGuid} OR ti.user_tg_guid is NULL)AND 
                t.task_available = true
            ORDER BY
                ti.date_completed DESC;
        `;

        if (tasksResult.count == 0 || !tasksResult.at(0)) {
            return null;
        }

        return tasksResult;
    } catch (error) {
        logger.error('Ошибка при получении данных о последней задаче:', error);
        return undefined;
    }
}
    export async function saveTaskInstance(taskInstance: TaskInstance): Promise<number | null> {
        try {
            console.log(taskInstance)
            const result = await sql`
                INSERT INTO ${sql(tasks_instances)} (
                    id,
                    task_id,
                    user_id,
                    user_tg_guid,
                    date_completed,
                    energy_reward_catched
                ) VALUES (
                    default,
                    ${taskInstance.task_id},
                    ${taskInstance.user_id},
                    ${taskInstance.user_tg_guid},
                    ${taskInstance.date_completed},
                    ${taskInstance.energy_reward_catched}
                )
                RETURNING id;
            `;
    
            if (result.count > 0 && result.at(0)) {
                return result.at(0).id as number;
            }
    
            return null;
        } catch (error) {
            logger.error('Ошибка при сохранении новой задачи:', error);
            return null;
        }
    }

    export async function getTaskCount(): Promise<number | null> {
        try {
            const result = await sql`
                SELECT COUNT(*) as count
                FROM ${sql(tasks)};
            `;
            if (result.count > 0 && result.at(0)) {
                return Number(result.at(0).count as number);
            }
            return null;
        } catch (error) {
            logger.error('Ошибка при получении количества задач:', error);
            return null;
        }
    }

    export async function saveTask(task: Task): Promise<number | null> {
        try {
            const result = await sql`
                INSERT INTO ${sql(tasks)} (
                    id,
                    is_daily,
                    energy_reward,
                    link,
                    task_type,
                    task_available
                ) VALUES (
                    default,
                    ${task.is_daily},
                    ${task.energy_reward},
                    ${task.link},
                    ${task.task_type},
                    ${task.task_available}
                )
                RETURNING id;
            `;
    
            if (result.count > 0 && result.at(0)) {
                return result.at(0).id as number;
            }
            return null;
        } catch (error) {
            logger.error('Ошибка при сохранении задачи:', error);
            return null;
        }
    }

    export async function saveTaskInfo(taskInfo: TaskInfo): Promise<number | null> {
        try {
            const result = await sql`
                INSERT INTO ${sql(tasks_info)} (
                    id,
                    task_id,
                    app_language,
                    title,
                    task_description
                ) VALUES (
                    default,
                    ${taskInfo.task_id},
                    ${taskInfo.app_language},
                    ${taskInfo.title},
                    ${taskInfo.task_description}
                )
                RETURNING id;
            `;
    
            if (result.count > 0 && result.at(0)) {
                return result.at(0).id as number;
            }
    
            return null;
        } catch (error) {
            logger.error('Ошибка при сохранении информации о задаче:', error);
            return null;
        }
    }