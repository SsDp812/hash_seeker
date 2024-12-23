import { Bot, Context} from 'grammy'
import BotConfig from '../config/app/bot-config'
import type { Payload } from '../dto/payments-payload';
import { logger } from '../config/app/logger-config';
import { DonateType } from '../common/donate-type';
import { buyNewAvatar } from '../service/image-service';
import { searchByTgGuid } from '../db/user-repository';
import type { User } from '../model/user';
import { boostEnergyCapicity, boostWallet } from '../service/wallet-service';
import { canBuyImage, validateCanBoostMiningLevel } from '../validation/prepayment-validator';


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
                let transactionPayload : Payload = JSON.parse(ctx.preCheckoutQuery?.invoice_payload as string)
                let user : User = await searchByTgGuid(ctx.preCheckoutQuery?.from.id as unknown as string) as unknown as User
                    if(user == null || user == undefined){
                        logger.error("User not found precheckout ", transactionPayload,ctx.message?.from.id as unknown as string)
                        return await ctx.answerPreCheckoutQuery(false,{
                            error_message: "Вы еще не зарегистрированы в приложении!"
                        });
                    }else{
                        if(transactionPayload.donateType === DonateType.IMAGE){
                            let valid : Boolean = await canBuyImage(user.tg_guid,transactionPayload.objectId);
                            if(!valid){
                                return await ctx.answerPreCheckoutQuery(false,{
                                    error_message: "Аватар уже куплен!"
                                });
                            }
                        }else if(transactionPayload.donateType === DonateType.MINING_BOOST){
                            let valid : Boolean = await validateCanBoostMiningLevel(user.tg_guid);
                            if(!valid){
                                return await ctx.answerPreCheckoutQuery(false,{
                                    error_message: "Вы прокачали уровень майнинга до максимального!"
                                });
                            }
                        }
                    }
                return await ctx.answerPreCheckoutQuery(true);
            } catch (e) {
                logger.error('answerPreCheckoutQuery failed');
                return await ctx.answerPreCheckoutQuery(false);
            }
        })

        BotManager.botIntsance.on('message', async (ctx: Context) => {
            try {
                if (!ctx.msg.successful_payment) {
                    logger.error(ctx.message);
                }else{
                    let transactionPayload : Payload = JSON.parse(ctx.update.message?.successful_payment?.invoice_payload as string)
                    let user : User = await searchByTgGuid(ctx.message?.from.id as unknown as string) as unknown as User
                    if(user == null || user == undefined){
                        logger.error("User not found after payment ", transactionPayload,ctx.message?.from.id as unknown as string)
                    }else{
                        if(transactionPayload.donateType === DonateType.IMAGE){
                            await buyNewAvatar(user.tg_guid,user.id,transactionPayload.objectId);
                        }else if(transactionPayload.donateType === DonateType.ENERGY_BOOST){
                            await boostEnergyCapicity(user.id)
                        }else if(transactionPayload.donateType === DonateType.MINING_BOOST){
                            await boostWallet(user.id);
                        }
                    }
                }
            } catch (e) {
                logger.error('successfull payment failed');
            }
        })
    }
    public static async isUserSubscribed(userId: number): Promise<boolean> {
        try {
            const chatMember = await BotManager.botIntsance.api.getChatMember(BotConfig.subscribeChannel, userId);
            console.log('chat', chatMember)
            if(chatMember == null || chatMember == undefined){
                console.log('none')
                return false;
            }
            console.log(chatMember)
            const statuses = ["member", "administrator", "creator"];
            return statuses.includes(chatMember.status);
        } catch (error) {
            logger.error("Ошибка при проверке подписки:", error);
            return false;
        }
    }
}
