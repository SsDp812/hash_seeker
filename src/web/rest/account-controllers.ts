import type Elysia from "elysia";
import { type WebAppData } from "../../dto/web-app-data";
import authMiddleware from "../../middleware/auth-middleware";
import { getTgUserInfo } from "../../service/account-service";
import { chooseAnotherAvatar, getCardsInfo, getPurchesedImagesByUser } from "../../service/image-service";
import type { ImageIntance } from "../../model/image-instance";
import { getBasicAppInfo } from "../../service/base-mechanic-service";

export const initializeAccountRoutes = async (app : Elysia) => {

    app.post('api/account-info', async (context: { body: any; headers: any; params: any }) => {
        let webData: WebAppData = context.body as WebAppData
        return { data: await getTgUserInfo(webData.web_app_data.user_id) }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/choose-avatar/:id', async (context: { body: any; headers: any; params: any }) => {
        const { id } = context.params;
        let webData: WebAppData = context.body as WebAppData;
        let purchasedImages: ImageIntance[] = await getPurchesedImagesByUser(webData.web_app_data.user_id) as ImageIntance[];
        const isPurchased = purchasedImages.some(purchased => purchased.image_id == id);
        if(isPurchased){
            await chooseAnotherAvatar(webData.web_app_data.user_id,id);
        }
        return { success: isPurchased }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/get-info-app', async (context: { body: any; headers: any; params: any }) => {
        let webData: WebAppData = context.body as WebAppData
        return { data: await getBasicAppInfo() }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/get-avatars-info', async (context: { body: any; headers: any; params: any }) => {
        let webData: WebAppData = context.body as WebAppData
        return { data: await getCardsInfo(webData.web_app_data.user_id) }
    },
    {
        beforeHandle: authMiddleware
    })
}
