import Elysia from 'elysia'
import ServerConfig from './config/app/server-config.ts'
import { logger } from './config/app/logger-config.ts'
import { BotManager } from './telegram/bot-manager.ts'
import authMiddleware from './middleware/auth-middleware.ts'
import { initializePaymentsRoutes } from './web/rest/payments-controllers.ts'
import { initializeStartAvatars } from './service/image-service.ts'
export const app = new Elysia();

app.all('/', authMiddleware);
initializeStartAvatars();
initializePaymentsRoutes(app);
app.listen(ServerConfig.port);
BotManager.startBot();
logger.info('Сервер запущен на порту ' + ServerConfig.port);
