import type Elysia from "elysia";
import { generateLinkForBoostEnergy,generateLinkForBuyNewImage,generateLinkForBoostMiningLevel } from "../../service/payments-service";
import { completeTask, getTasks } from "../../service/task-service.ts";
import { type WebAppData } from "../../dto/web-app-data";
import authMiddleware from "../../middleware/auth-middleware.ts";


export const initializeTasksRoutes = async (app : Elysia) => {

    app.post('api/getTasks/:language', async (context: { body: any; headers: any; params: any }) => {
        const { language } = context.params;
        let webData: WebAppData = context.body as WebAppData
        return {
            tasks: await getTasks(webData.web_app_data.user_id,language)
        }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/completeTask/:id', async (context: { body: any; headers: any; params: any }) => {
        const { id } = context.params;
        let webData: WebAppData = context.body as WebAppData

        return {
            success: await completeTask(webData.web_app_data.user_id,id)
        }
    },
    {
        beforeHandle: authMiddleware
    })
}


