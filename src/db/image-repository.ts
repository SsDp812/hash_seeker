import sql from "../config/app/db-config";
import { logger } from "../config/app/logger-config";
import type { ImageAvatar } from "../model/image";

const images_table_name = 'image_info'

export async function getAllImages() {
    try {
        const images = await sql`
            SELECT * FROM ${sql(images_table_name)};
        `;
        if (images.count === 0 || images.length === 0) {
            return []; 
        } else {
            return images;
        }
    } catch (error) {
        logger.error('Ошибка при получении всех изображений:', error);
        return undefined; 
    }
}

export async function saveNewImage(image: ImageAvatar) {
    try {
        const result = await sql`
            INSERT INTO ${sql(images_table_name)} (id, image_name)
            VALUES (default, ${image.image_name})
            RETURNING id;
        `;

        if (result.count === 0 || result.length === 0) {
            return null;
        } else {
           
            return { ...image, id: result.at(0).id as number };
        }
    } catch (error) {
        logger.error('Ошибка при сохранении нового изображения:', error);
        return undefined;
    }
}