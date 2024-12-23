import sql from "../config/app/db-config";
import { logger } from "../config/app/logger-config";
import type { ActiveImageInstance, ImageIntance } from "../model/image-instance";

const images_instance_table_name = 'image_user_instance'
const images_table_name = 'image_info'

export async function getAllInstancesByUserGuid(tgUserGuid: string) {
    try {
        const instances = await sql`
            SELECT * FROM ${sql(images_instance_table_name)}
            WHERE tg_user_guid = ${tgUserGuid};
        `;

        if (instances.count === 0 || instances.length === 0) {
            return [];
        } else {
            return instances;
        }
    } catch (error) {
        logger.error('Ошибка при получении всех экземпляров по tg_user_guid:', error);
        return undefined;
    }
}


export async function getActiveInstanceByUserGuid(tgUserGuid: string) {
    try {
        const instances = await sql`
            SELECT ${sql(images_instance_table_name)}.id, ${sql(images_instance_table_name)}.tg_user_id, active_status, image_id, image_name FROM ${sql(images_instance_table_name)}
            INNER JOIN ${sql(images_table_name)} on ${sql(images_instance_table_name)}.image_id = ${sql(images_table_name)}.id
            WHERE tg_user_guid = ${tgUserGuid}
            AND active_status is true LIMIT 1;
        `;

        if (instances.count === 0 || instances.length === 0) {
            return [];
        } else {
            return instances.at(0) as ActiveImageInstance;
        }
    } catch (error) {
        logger.error('Ошибка при получении всех экземпляров по tg_user_guid:', error);
        return undefined;
    }
}


export async function createImageUserInstance(newIntance : ImageIntance) {
    try {
        const newInstance = await sql`
            INSERT INTO ${sql(images_instance_table_name)} (id, tg_user_id, tg_user_guid, active_status, image_id)
            VALUES (default, ${newIntance.tg_user_id}, ${newIntance.tg_user_guid},${newIntance.active_status}, ${newIntance.image_id})
            RETURNING *;
        `;

        if (newInstance.count === 0 || newInstance.length === 0) {
            return null;
        } else {
            return newInstance.at(0);
        }
    } catch (error) {
        logger.error('Ошибка при создании нового экземпляра:', error);
        return undefined;
    }
}

export async function setActiveImage(tgUserGuid: string, imageId: number) {
    try {
        await sql`
            UPDATE ${sql(images_instance_table_name)}
            SET active_status = false
            WHERE tg_user_guid = ${tgUserGuid}
            AND image_id != ${imageId};
        `;

        const updatedInstance = await sql`
            UPDATE ${sql(images_instance_table_name)}
            SET active_status = true
            WHERE tg_user_guid = ${tgUserGuid}
            AND image_id = ${imageId}
            RETURNING *;
        `;

        if (updatedInstance.count === 0 || updatedInstance.length === 0) {
            return null; 
        } else {
            return updatedInstance.at(0) as ImageIntance; 
        }
    } catch (error) {
        logger.error('Ошибка при обновлении статуса изображения:', error);
        return undefined;
    }
}
