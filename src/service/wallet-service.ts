import type { Wallet } from '../model/wallet'
import AccountLogicConfig from '../config/mechanic/account-logic-config.ts'
import MiningBoostLevel from '../common/mining-boost-level'
import { saveNewWallet, increaseMaxEnergy, increaseMaxEnergyAndCharge,findWalletByTgGuid, updateMiningBoostLevel } from '../db/wallet-reposiory.ts'

export const createNewWallet = async (userId: number,tgGuid : string) => {
    let wallet: Wallet = {
        coins_amount: AccountLogicConfig.startBalance as number,
        id: 0,
        tg_guid: tgGuid,
        tg_user_id: userId,
        energy_amount: AccountLogicConfig.startEnergyAmount as number,
        max_energy_capicity: AccountLogicConfig.startMaxEnergyCapicity as number,
        testing_energy_amount: AccountLogicConfig.startTestingEnergyAmount as number,
        mining_boost_level: MiningBoostLevel.None,
    }
    return saveNewWallet(wallet)
}

export const boostEnergyCapicity = async (userId : number) => {
    if(AccountLogicConfig.chargeEnergyWhileBoost){
        increaseMaxEnergyAndCharge(userId,AccountLogicConfig.energyCapicityBoostLevel)
    }else{
        increaseMaxEnergy(userId,AccountLogicConfig.energyCapicityBoostLevel)
    }
}

export const searchWallet = async (tgGuid : string) => {
    return await findWalletByTgGuid(tgGuid).then(wallet => {return wallet as Wallet;});
}
export const boostWallet = async (userId: number) => {
    return await updateMiningBoostLevel(userId);
}