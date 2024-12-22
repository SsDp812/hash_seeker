import type { Wallet } from '../model/wallet'
import AccountLogicConfig from '../config/mechanic/account_logic_config.ts'
import MiningBoostLevel from '../common/mining_boost_level'
import { SaveNewWallet } from '../db/wallet_reposiory.ts'

export const CreateNewWallet = async (userId: number) => {
    let wallet: Wallet = {
        coins_amount: AccountLogicConfig.startBalance as number,
        id: 0,
        tg_user_id: userId,
        energy_amount: AccountLogicConfig.startEnergyAmount as number,
        testing_energy_amount:
            AccountLogicConfig.startTestingEnergyAmount as number,
        mining_boost_level: MiningBoostLevel.None,
    }
    return SaveNewWallet(wallet)
}
