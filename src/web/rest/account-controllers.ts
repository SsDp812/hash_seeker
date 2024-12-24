import type Elysia from "elysia";
import { type WebAppData } from "../../dto/web-app-data";
import authMiddleware from "../../middleware/auth-middleware";
import { connectReferealLink, getReferalLink, getTgUserInfo, getTopUsersPage } from "../../service/account-service";
import { chooseAnotherAvatar, getCardsInfo, getPurchesedImagesByUser } from "../../service/image-service";
import type { ImageIntance } from "../../model/image-instance";
import { getBasicAppInfo } from "../../service/base-mechanic-service";
import { isNumeric, isUUID } from "../../validation/injection-validator";

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
        if(!isNumeric(id)){
            console.warn("Paramter is not numeric, ", id)
            return {succcess: false}
        }
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

    app.post('api/users-top/:pageLimit', async (context: { body: any; headers: any; params: any }) => {
        const { pageLimit } = context.params;
        if(!isNumeric(pageLimit)){
            console.warn("Paramter is not numeric, ", pageLimit)
            return {succcess: false}
        }
        let webData: WebAppData = context.body as WebAppData
        return { data: await getTopUsersPage(pageLimit) }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/connect-link/:referalCode', async (context: { body: any; headers: any; params: any }) => {
        const { referalCode } = context.params;
        if(!isUUID(referalCode)){
            console.warn("Paramter is not UUID, ", referalCode)
            return {succcess: false}
        }
        let webData: WebAppData = context.body as WebAppData
        return { data: await connectReferealLink(webData.web_app_data.user_id,referalCode) }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/get-my-referal-code', async (context: { body: any; headers: any; params: any }) => {
        let webData: WebAppData = context.body as WebAppData
        return { data: await getReferalLink(webData.web_app_data.user_id) }
    },
    {
        beforeHandle: authMiddleware
    })
}
