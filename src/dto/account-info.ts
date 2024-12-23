import type MiningBoostLevel from "../common/mining-boost-level"

export interface AccountInfo{
    username: string
    balance: number
    energyAmount: number
    maxEnergyCapicity: number
    miningLevel: MiningBoostLevel
    activeImageId: number
    activeImagePath: string
}