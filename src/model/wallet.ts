import type MiningBoostLevel from '../common/mining-boost-level.ts'

export interface Wallet {
    id: number
    tg_user_id: number
    tg_guid: string
    coins_amount: number
    energy_amount: number
    max_energy_capicity: number
    testing_energy_amount: number
    mining_boost_level: MiningBoostLevel
}
