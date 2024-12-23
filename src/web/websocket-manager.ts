import type Elysia from 'elysia'
import ServerConfig from '../config/app/server-config.ts'
import authMiddleware from '../middleware/auth-middleware.ts'
import { websocket } from 'elysia/ws'

export class WebSockerManager{
    private static connectedClients: WebSocket[] = [];
    public static startWebSocketServer(app : Elysia){
        app.ws('/ws', {
            message(ws, message) {
                WebSockerManager.sendUpdateInfo("che nado tebe?");
            },
            open(ws) {
                console.log('socket opened')
                WebSockerManager.connectedClients.push(ws);
            },
            close(ws) {
                console.log('socker closed')
               
            }
        });
    }

    private static sendUpdateInfo(message: string){
        this.connectedClients.forEach((client: { readyState: number; send: (arg0: string) => void; }) => {
            client.send(message); 
        });
    }
}