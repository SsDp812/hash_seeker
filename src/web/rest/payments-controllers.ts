import type Elysia from "elysia";
import { generateLinkForBoostEnergy,generateLinkForBuyNewImage,generateLinkForBoostMiningLevel } from "../../service/payments-service";
import { type WebAppData } from "../../dto/web-app-data";
import authMiddleware from "../../middleware/auth-middleware";

export const initializePaymentsRoutes = async (app : Elysia) => {

    app.post('api/buyNewImage/:id', async (context: { body: any; headers: any; params: any }) => {
        const { id } = context.params;
        let webData: WebAppData = context.body as WebAppData
        return { invoiceLink: await generateLinkForBuyNewImage(id) }
    },
    {
        beforeHandle: authMiddleware
    })
    app.post('api/boostMiningLevel', async (context) => {
        let webData: WebAppData = context.body as WebAppData
        return { invoiceLink: await generateLinkForBoostMiningLevel() }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/boostEnergyCapicity', async (context) => {
        let webData: WebAppData = context.body as WebAppData
        return { invoiceLink: await generateLinkForBoostEnergy() }
    },
    {
        beforeHandle: authMiddleware
    })
}


