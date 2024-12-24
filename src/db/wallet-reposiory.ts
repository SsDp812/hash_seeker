import type { Wallet } from '../model/wallet.ts'
import sql from '../config/app/db-config.ts'
import { logger } from '../config/app/logger-config.ts'
import MiningBoostLevel from '../common/mining-boost-level.ts'

const wallets_table_name = 'user_wallets_tg_info'

export async function saveNewWallet(wallet: Wallet) {
    try {
        const id = await sql`
            INSERT INTO ${sql(wallets_table_name)} (id,tg_user_id,tg_guid,coins_amount,energy_amount,max_energy_capicity,testing_energy_amount,mining_boost_level)
            VALUES (default,${wallet.tg_user_id},${wallet.tg_guid},${wallet.coins_amount},${wallet.energy_amount},${wallet.max_energy_capicity},${wallet.testing_energy_amount},
            ${wallet.mining_boost_level})
            RETURNING id;
        `
        if (id.count == 0 || id.at(0) == undefined || id.at(0) == null) {
            return null
        } else {
            wallet.id = id.at(0).id as number
            return wallet
        }
    } catch (error) {
        logger.error('Ошибка при сохранении нового кошелька:', error)
        return undefined
    }
}


export async function increaseMaxEnergy(tgUserId: number, increaseAmount: number) {
    try {
        const result = await sql`
            UPDATE ${sql(wallets_table_name)}
            SET max_energy_capicity = max_energy_capicity * ${increaseAmount}
            WHERE tg_user_id = ${tgUserId}
            RETURNING *; 
        `;

        if (result.count === 0 || result.at(0) === undefined || result.at(0) === null) {
            return null; 
        } else {
            return result.at(0) as Wallet; 
        }
    } catch (error) {
        logger.error('Ошибка при увеличении max_energy_capicity:', error);
        return undefined;
    }

}

    export async function increaseMaxEnergyAndCharge(tgUserId: number, increaseAmount: number) {
        try {
            const result = await sql`
                UPDATE ${sql(wallets_table_name)}
                SET 
                    max_energy_capicity = max_energy_capicity * ${increaseAmount},
                    energy_amount = max_energy_capicity * ${increaseAmount}
                WHERE tg_user_id = ${tgUserId}
                RETURNING *;  -- Возвращаем обновленную строку
            `;
    
            if (result.count === 0 || result.at(0) === undefined || result.at(0) === null) {
                return null;
            } else {
                return result.at(0) as Wallet;
            }
        } catch (error) {
            logger.error('Ошибка при увеличении max_energy_capicity и energy_amount:', error);
            return undefined
        }
    }

    export async function chargeWallet(userId: number, amount: number) {
        try {
            const result = await sql`
                UPDATE ${sql(wallets_table_name)}
                SET 
                    energy_amount = LEAST(energy_amount + ${amount}, max_energy_capicity)
                WHERE tg_user_id = ${userId}
                RETURNING *;
            `;
    
            if (result.count === 0 || result.at(0) === undefined || result.at(0) === null) {
                return null;
            } else {
                return result.at(0) as Wallet;
            }
        } catch (error) {
            logger.error('Ошибка при обновлении energy_amount:', error);
            return undefined;
        }
    }

    export async function findWalletByTgGuid(tgGuid: string) {
        try {
            const wallet = await sql`
                SELECT * FROM ${sql(wallets_table_name)}
                WHERE tg_guid = ${tgGuid}
                LIMIT 1;
            `;
    
            if (wallet.count === 0 || wallet.at(0) === undefined || wallet.at(0) === null) {
                return null;
            } else {
                return wallet.at(0) as Wallet;
            }
        } catch (error) {
            logger.error('Ошибка при поиске кошелька по tg_guid:', error);
            return undefined;
        }
    }
    
    export async function updateMiningBoostLevel(tgUserId: number) {
        try {
            const updatedWallets = await sql`
                UPDATE ${sql(wallets_table_name)}
                SET mining_boost_level = CASE
                    WHEN mining_boost_level = ${MiningBoostLevel.None} THEN ${MiningBoostLevel.Lite}
                    WHEN mining_boost_level = ${MiningBoostLevel.Lite} THEN ${MiningBoostLevel.HARD}
                    ELSE mining_boost_level
                END
                WHERE tg_user_id = ${tgUserId}
                RETURNING *;
            `;
    
            if (updatedWallets.count === 0 || updatedWallets.length === 0) {
                return null;
            } else {
                return updatedWallets;
            }
        } catch (error) {
            logger.error('Ошибка при обновлении уровня майнинга:', error);
            return undefined;
        }
    }