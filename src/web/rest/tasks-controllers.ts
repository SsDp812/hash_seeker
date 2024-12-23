import type Elysia from "elysia";
import { generateLinkForBoostEnergy,generateLinkForBuyNewImage,generateLinkForBoostMiningLevel } from "../../service/payments-service";
import TaskService from "../../service/task-service.ts";
import { type WebAppData } from "../../dto/web-app-data";


export const initializeTasksRoutes = async (app : Elysia) => {

    app.post('api/getTasks', async (context: { body: any; headers: any; params: any }) => {
        let webData: WebAppData = context.body as WebAppData
        return {
            daily_tasks: await TaskService.getDailyTasks(webData.web_app_data.user_id),
            usual_tasks: await TaskService.getUsualTasks(webData.web_app_data.user_id)
        }
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


