import type Elysia from "elysia";
import { generateLinkForBoostEnergy,generateLinkForBuyNewImage,generateLinkForBoostMiningLevel } from "../../service/payments-service";
import { type WebAppData } from "../../dto/web-app-data";
import authMiddleware from "../../middleware/auth-middleware";
import { connectTonWallet, getTonWalletInfo } from "../../service/managers/ton-wallet-manager";

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

    app.post('api/connect-wallet/:address', async (context) => {
        const { address } = context.params;
        let webData: WebAppData = context.body as WebAppData
        return { data: await connectTonWallet(webData.web_app_data.user_id,address) }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/get-wallet-info', async (context) => {
        let webData: WebAppData = context.body as WebAppData
        return { data: await getTonWalletInfo(webData.web_app_data.user_id) }
    },
    {
        beforeHandle: authMiddleware
    })
}


