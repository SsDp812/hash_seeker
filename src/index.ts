import Elysia from 'elysia'
import ServerConfig from './config/app/server-config.ts'
import { logger } from './config/app/logger-config.ts'
import { BotManager } from './telegram/bot-manager.ts'
import authMiddleware from './middleware/auth-middleware.ts'
import { initializePaymentsRoutes } from './web/rest/payments-controllers.ts'
import { initializeStartAvatars } from './service/image-service.ts'
import staticPlugin from '@elysiajs/static'
import { WebSockerManager } from './web/websocket-manager.ts'
import {initializeTasksRoutes} from "./web/rest/tasks-controllers.ts";
import { initializeAccountRoutes } from './web/rest/account-controllers.ts'
import { initializeStartTasks } from './service/task-manager.ts'


export const app = new Elysia();

app.use(staticPlugin())

const avatarsInit : any = await initializeStartAvatars();
const paymentsInit : any = await initializePaymentsRoutes(app);
const tasksInit: any = await initializeTasksRoutes(app);
const accountsInit : any = await initializeAccountRoutes(app);
const initTasks : any = await initializeStartTasks();
WebSockerManager.startWebSocketServer(app);
BotManager.startBot();
app.listen(ServerConfig.port);
logger.info('Сервер запущен на порту ' + ServerConfig.port);


