import type Elysia from "elysia";
import { generateLinkForBoostEnergy,generateLinkForBuyNewImage,generateLinkForBoostMiningLevel } from "../../service/payments-service";
import { type WebAppData } from "../../dto/web-app-data";

export const initializePaymentsRoutes = async (app : Elysia) => {

    app.post('api/buyNewImage/:id', async (context: { body: any; headers: any; params: any }) => {
        const { id } = context.params;
        let webData: WebAppData = context.body as WebAppData
        return { invoiceLink: await generateLinkForBuyNewImage(id,webData.web_app_data.user_id as unknown as number) }
    })

    app.post('api/boostMiningLevel', async (context) => {
        let webData: WebAppData = context.body as WebAppData
        return { invoiceLink: await generateLinkForBoostMiningLevel(webData.web_app_data.user_id as unknown as number) }
    })

    app.post('api/boostEnergyCapicity', async (context) => {
        let webData: WebAppData = context.body as WebAppData
        return { invoiceLink: await generateLinkForBoostEnergy(webData.web_app_data.user_id as unknown as number) }
    })
}


