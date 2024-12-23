import type { AppLanguage } from "../common/app-languages"
import type TaskType from "../common/task-types"


export interface UserTaskInfoFromDb{
    task_id: number
    date_completed: Date | null | undefined
    task_title: string
    task_description: string
    app_language: AppLanguage
    link: string
    energy_reward: number
    isDaily: boolean
    task_type: TaskType
}

export interface UserTaskForUI extends UserTaskInfoFromDb{
    isDone: boolean
}