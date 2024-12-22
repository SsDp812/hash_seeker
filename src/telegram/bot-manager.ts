import { Bot, Context} from 'grammy'
import BotConfig from '../config/app/bot-config'
import type { Payload } from '../dto/payments-payload';
import { logger } from '../config/app/logger-config';


export class BotManager{
        private static botIntsance : Bot = new Bot(BotConfig.botToken);

    public static startBot(){
        BotManager.initializeBotEventHandlers();
        BotManager.botIntsance.start();
    }

    public static async createInvoiceLink(orderTitle : string, orderDescription : string, orderPayload : Payload, price : number){
        const title = orderTitle;
        const description = orderDescription;
        const payload = JSON.stringify(orderPayload);
        const currency = 'XTR';
        const prices = [{ amount: price, label: title }];

       const invoiceLink = await BotManager.botIntsance.api.createInvoiceLink(
           title,
           description,
           payload,
           '',
           currency,
           prices
       );
       return invoiceLink;
    }

    private static initializeBotEventHandlers(){
        BotManager.botIntsance.on('pre_checkout_query', async (ctx: Context) => {
            try {
                //TODO проверять/валидировать возможно ли покупка с помощью prepayment-validator
                return await ctx.answerPreCheckoutQuery(true);
            } catch (e) {
                logger.error('answerPreCheckoutQuery failed');
            }
        })

        BotManager.botIntsance.on('message', async (ctx: Context) => {
            try {
                if (!ctx.msg.successful_payment) {
                    logger.error(ctx.message);
                }
            } catch (e) {
                logger.error('successfull payment failed');
            }
        })
    }
}
