import type MiningBoostLevel from "../common/mining_boost_level.ts";

export interface Wallet{
    id: number,
    tg_user_id: number,
    coins_amount: number,
    energy_amount: number,
    testing_energy_amount: number,
    mining_boost_level: MiningBoostLevel
}