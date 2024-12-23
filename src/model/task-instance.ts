export interface TaskInstance{
    id: number
    task_id: number
    user_id: number
    user_tg_guid: string
    date_completed: Date
    energy_reward_catched: number
}