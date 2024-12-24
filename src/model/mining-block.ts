import type { RelationBlockType } from "../common/relation-block-type"

export interface MiningBlockDto extends MiningBlock{
    my_reward: number
    relation_block_info: RelationBlockType
}

export interface MiningBlock{
    id: number
    hash: string
    user_tg_guid: string
    user_id: number
    miner_name: string
    minerReward: number
    shared_reward: number
    date: Date
}

export interface MiningBlockSharedInfo{
    id: number
    block_id: number
    shared_user_id: number | null
    shared_user_guid: string
    user_reward: number
}