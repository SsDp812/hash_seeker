import sql from "../config/app/db-config";
import type { StartsTransaction } from "../model/stars-transacrion";



export async function saveStartTransaction(transaction: StartsTransaction): Promise<StartsTransaction | null> {
    try {
        const result = await sql`
            INSERT INTO starts_transactions (
                id,
                obj_id,
                date_transaction,
                tg_guid,
                price,
                donate_type
            ) VALUES (
                default,
                ${transaction.obj_id},
                ${transaction.date_transaction},
                ${transaction.tg_guid},
                ${transaction.price},
                ${transaction.donate_type}
            )
            RETURNING id;
        `;

        if (result.count === 0 || !result[0]) {
            return null;
        }
        transaction.id = result[0].id as number;
        return transaction;
    } catch (error) {
        console.error('Ошибка при сохранении новой транзакции:', error);
        return null;
    }
}