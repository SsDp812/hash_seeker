import { Elysia } from "elysia";
import {AuthMiddleware} from "./middleware/auth_middleware.ts";
import ServerConfig from "./config/app/server_config.ts";
import {logger} from "./config/app/logger_config.ts";

const app = new Elysia();


app.post("/", (context) => {
    return { message: "Hello, world!" };
    },
    {
        beforeHandle: AuthMiddleware
    }
);

app.listen(ServerConfig.port);
logger.info("Сервер запущен на порту " + ServerConfig.port);