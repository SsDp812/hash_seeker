import sql from "../config/app/db-config";
import { logger } from "../config/app/logger-config";
import type { TonWallet } from "../model/ton-wallet";

const ton_wallet_table = 'ton_wallets'

export async function findWalletByUserGuid(userGuid: string): Promise<TonWallet | null> {
    try {
        const result = await sql`
            SELECT * FROM ${sql(ton_wallet_table)}
            WHERE user_guid = ${userGuid}
            LIMIT 1;
        `;
        return result.count > 0 ? result.at(0) as TonWallet : null;
    } catch (error) {
        logger.error('Ошибка при поиске кошелька:', error);
        return null;
    }
}

export async function createNewWallet(wallet: TonWallet): Promise<TonWallet | null> {
    try {
        const result = await sql`
            INSERT INTO ${sql(ton_wallet_table)} (
                id, user_id, user_guid, wallet_address, date_created
            ) VALUES (
                default,
                ${wallet.user_id},
                ${wallet.user_guid},
                ${wallet.wallet_address},
                ${wallet.date_created}
            )
            RETURNING *;
        `;
        return result.count > 0 ? result.at(0) as TonWallet : null;
    } catch (error) {
        logger.error('Ошибка при создании нового кошелька:', error);
        return null;
    }
}

export async function updateWalletByUserGuid(
    userGuid: string,
    newWalletAddress: string,
    newDateCreated: Date
): Promise<boolean> {
    try {
        const result = await sql`
            UPDATE ${sql(ton_wallet_table)}
            SET
                wallet_address = ${newWalletAddress},
                date_created = ${newDateCreated}
            WHERE user_guid = ${userGuid};
        `;
        return result.count > 0;
    } catch (error) {
        logger.error('Ошибка при обновлении кошелька:', error);
        return false;
    }
}

export async function findWalletByAddress(walletAddress: string): Promise<TonWallet | null> {
    try {
        const result = await sql`
            SELECT * FROM ton_wallets
            WHERE wallet_address = ${walletAddress}
            LIMIT 1;
        `;
        return result.count > 0 ? result.at(0) as TonWallet : null;
    } catch (error) {
        logger.error('Ошибка при поиске кошелька по адресу:', error);
        return null;
    }
}