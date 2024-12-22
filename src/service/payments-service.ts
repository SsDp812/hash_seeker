import type { Payload } from "../dto/payments-payload"
import { DonateType } from "../common/donate-type"
import { BotManager } from "../telegram/bot-manager"
import { PaymentTitles } from "../config/mechanic/order-titles-config"
import { OrderPrices } from "../config/mechanic/order-prices-config"


export const generateLinkForBuyNewImage = async (imageId: number, userId: number) => {
    let payload : Payload = {
            date: Date.now(),
            donateType: DonateType.IMAGE,
            objectId: imageId
    };
    return BotManager.createInvoiceLink(PaymentTitles.imageOrderTitle,
        PaymentTitles.imageOrderDescription,payload,OrderPrices.imageStarsPrice);
}


export const generateLinkForBoostEnergy = async (userId: number) => {
    let payload : Payload = {
            date: Date.now(),
            donateType: DonateType.ENERGY_BOOST,
            objectId: 0
    };
    return BotManager.createInvoiceLink(PaymentTitles.updateEnergyOrderTitle,
        PaymentTitles.updateEnergyDescription,payload,OrderPrices.energyStarsPrice);
}

export const generateLinkForBoostMiningLevel = async (userId: number) => {
    let payload : Payload = {
            date: Date.now(),
            donateType: DonateType.MINING_BOOST,
            objectId: 0
    };
    return BotManager.createInvoiceLink(PaymentTitles.boostMiningLevelOrderTitle,
        PaymentTitles.boostMiningLevelOrderDescription,payload,OrderPrices.miningBoostStarsPrice);
}

