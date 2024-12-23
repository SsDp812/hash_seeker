import MiningBoostLevel from "../common/mining-boost-level";
import { logger } from "../config/app/logger-config";
import type { ImageIntance } from "../model/image-instance";
import type { Wallet } from "../model/wallet"
import { getPurchesedImagesByUser } from "../service/image-service";
import { searchWallet } from "../service/wallet-service"

export const validateCanBoostMiningLevel = async (tgGuid : string) => {
    let wallet : Wallet = await searchWallet(tgGuid).then(wallet => {return wallet as Wallet});
    if(wallet == null || wallet == undefined){
        return false;
    }else if(wallet.mining_boost_level === MiningBoostLevel.Lite || wallet.mining_boost_level ===  MiningBoostLevel.None){
        return true;
    }else{
        return false;
    }
}

export const canBuyImage = async (tgGuid: string, imageId: number) => {
    try {
        let images: ImageIntance[] = await getPurchesedImagesByUser(tgGuid);
        console.log(images)
        console.log(imageId)
        const imageExists = images.some(image => image.image_id == imageId);
        return !imageExists;
    } catch (error) {
        logger.error('Ошибка при проверке возможности покупки изображения:', error);
        return false;
    }
}
