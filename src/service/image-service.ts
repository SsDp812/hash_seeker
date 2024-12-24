import { getAllImages, saveNewImage, getRandomImageId } from "../db/image-repository"
import { getAllInstancesByUserGuid,createImageUserInstance, setActiveImage} from "../db/image-instance-repository";
import type { ImageAvatar } from "../model/image";
import type { ImageIntance } from "../model/image-instance";
import type { ImagerDto } from "../dto/image-dto";
import fs from 'fs';
import path from 'path';
import ServerConfig from "../config/app/server-config";
import { logger } from "../config/app/logger-config";


export const getAll = async () => {
    return await getAllImages().then(images => {return images;});
}

export const getPurchesedImagesByUser = async (tgGuid : string) => {
    return await getAllInstancesByUserGuid(tgGuid).then(images => {return images;});
}

export const getCardsInfo = async (tgGuid: string) => {
    let images: ImageAvatar[] = await getAll();
    let purchasedImages: ImageIntance[] = await getPurchesedImagesByUser(tgGuid).then(images => {return images;});

    let imageDtos: ImagerDto[] = [];
    images.forEach(image => {
        const isPurchased = purchasedImages.some(purchased => purchased.image_id === image.id);
        let isActiveStatus = false;
        if(isPurchased){
            const purchasedImage = purchasedImages.find(purchased => purchased.image_id === image.id);
            isActiveStatus = purchasedImage?.active_status as boolean;
        }
        const imageDto: ImagerDto = {
            image_name: image.image_name,
            is_purchesed: isPurchased,
            is_active: isActiveStatus,
            image_id: image.id,
        };
        imageDtos.push(imageDto);
    });

    return imageDtos; 
};

export const buyNewAvatar = async (tgGuid : string, userId : number, imageId: number) => {
    let newInstance : ImageIntance = {
        id: 0,
        tg_user_id: userId,
        tg_user_guid: tgGuid,
        active_status: true,
        image_id: imageId
    }
    return await createImageUserInstance(newInstance).then(async image => {
        await setActiveImage(tgGuid,imageId)
        return true
    });

}

export const chooseAnotherAvatar = async (tgGuid : string, imageId : number) => {
    return await setActiveImage(tgGuid,imageId);
}

export const generateRandomAvatarForNewUser = async (tgGuid : string, userId: number) => {
    let id : number = await getRandomImageId();
    return await buyNewAvatar(tgGuid,userId,id).then(imageInstance => {return imageInstance;});
}

export const initializeStartAvatars = async() => {
    let fileNames = []
    let images: ImageAvatar[] = await getAll();
    if(images.length == 0){
        const directory = path.join(__dirname, ServerConfig.staticFilesPathForInit);
        try {
            const files = fs.readdirSync(directory);
            fileNames = files.filter(file => {
                const filePath = path.join(directory, file);
                return fs.statSync(filePath).isFile();
            });
            fileNames.forEach(async fileName => {
                let id : number = await saveNewImage({
                    id: 0,
                    image_name: fileName
                }) as unknown as number
            })
        } catch (error) {
            logger.error('Ошибка при чтении директории:', error);
        }
    }
}