import sql from "../config/app/db-config";
import { logger } from "../config/app/logger-config";

const mining_blocks_table = 'mining_blocks'

export async function getMiningBlockCount(): Promise<number | null> {
    try {
        const result = await sql`
            SELECT COUNT(*) as count
            FROM ${sql(mining_blocks_table)};
        `;
        if (result.count > 0 && result.at(0)) {
            return Number(result.at(0).count);
        }
        return null;
    } catch (error) {
        logger.error('Ошибка при получении количества mining_blocks:', error);
        return null;
    }
}