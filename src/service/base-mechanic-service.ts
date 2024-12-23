import MiningLogicConfig from "../config/mechanic/mining-logic-config"
import { OrderPrices } from "../config/mechanic/order-prices-config"
import type { AppInfo } from "../dto/app-info"


export const getBasicAppInfo = async () => {
    let appInfo : AppInfo = {
        imagePrice: OrderPrices.imageStarsPrice,
        miningBoostPrice: OrderPrices.miningBoostStarsPrice,
        energyBoostPrice: OrderPrices.energyStarsPrice,
        minimalEnergyUnit: OrderPrices.miningBoostStarsPrice,
        rewardForFriend: OrderPrices.rewardForFriend,
        currentOnline: await getCurrentOnline()
    }
    return appInfo;
}

export const getCurrentOnline = async () => {
    //TODO прибавить к захардкоженному еще реальный онлайн
    return MiningLogicConfig.hardCodeOnline;
}