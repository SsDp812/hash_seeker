import sql from "../config/app/db-config";
import { logger } from "../config/app/logger-config";
import type { ImageIntance } from "../model/image-instance";

const images_instance_table_name = 'image_user_instance'


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
