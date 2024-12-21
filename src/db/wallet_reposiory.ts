import type {Wallet} from "../model/wallet.ts";
import sql from '../config/app/db_config.ts';
import { logger } from '../config/app/logger_config.ts';

const wallets_table_name = 'user_wallets_tg_info'

export async function SaveNewWallet(wallet : Wallet){
    try {
        console.log(wallet)
        const id = await sql`
            INSERT INTO ${sql(wallets_table_name)} (id,tg_user_id,coins_amount,energy_amount,testing_energy_amount,mining_boost_level)
            VALUES (default,${wallet.tg_user_id},${wallet.coins_amount},${wallet.energy_amount},${wallet.testing_energy_amount},
            ${wallet.mining_boost_level})
            RETURNING id;
        `;
        if(id.count == 0 || id.at(0) == undefined || id.at(0) == null){
            return null;
        }else{
          wallet.id = id.at(0).id as number;
          return wallet;
        }
    } catch (error) {
        logger.error('Ошибка при сохранении нового кошелька:', error);
        return undefined;
    }
}