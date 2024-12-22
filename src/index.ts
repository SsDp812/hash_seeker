import Elysia from 'elysia'
import ServerConfig from './config/app/server_config.ts'
import { logger } from './config/app/logger_config.ts'
import { bot } from './telegram/bot.ts'
import authMiddleware from './middleware/auth_middleware.ts'

export const app = new Elysia()

app.all('/', authMiddleware)

app.listen(ServerConfig.port)

bot.start()

logger.info('Сервер запущен на порту ' + ServerConfig.port)
