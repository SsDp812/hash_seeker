import type TaskType from "../common/task-types.ts";

export interface Task {
    task_id: number
    is_daily: boolean
    energy_reward: number
    title: string
    description: string
    task_type: TaskType
}
