import type { AppLanguage } from "../common/app-languages.ts";
import type TaskType from "../common/task-types.ts";

export interface Task {
    id: number
    is_daily: boolean
    energy_reward: number
    link: string
    task_type: TaskType
    task_available: boolean
}

export interface TaskInfo{
    id: number
    task_id: number
    app_language: AppLanguage
    title: string
    task_description: string
}