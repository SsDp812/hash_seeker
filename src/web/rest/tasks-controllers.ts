import type Elysia from "elysia";
import { generateLinkForBoostEnergy,generateLinkForBuyNewImage,generateLinkForBoostMiningLevel } from "../../service/payments-service";
import TaskService from "../../service/task-service.ts";
import { type WebAppData } from "../../dto/web-app-data";
import authMiddleware from "../../middleware/auth-middleware.ts";


export const initializeTasksRoutes = async (app : Elysia) => {

    app.post('api/getTasks', async (context: { body: any; headers: any; params: any }) => {
        let webData: WebAppData = context.body as WebAppData
        return {
            daily_tasks: await TaskService.getDailyTasks(webData.web_app_data.user_id),
            usual_tasks: await TaskService.getUsualTasks(webData.web_app_data.user_id)
        }
    },
    {
        beforeHandle: authMiddleware
    })

    app.post('api/completeTask/:id', async (context: { body: any; headers: any; params: any }) => {
        const { id } = context.params;
        let webData: WebAppData = context.body as WebAppData
        return {
            daily_tasks: await TaskService.getDailyTasks(webData.web_app_data.user_id),
            usual_tasks: await TaskService.getUsualTasks(webData.web_app_data.user_id)
        }
    },
    {
        beforeHandle: authMiddleware
    })
}


