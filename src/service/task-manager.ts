import { AppLanguage } from "../common/app-languages"
import { getTaskCount, saveTask, saveTaskInfo } from "../db/tasks-repository";
import type { UserTaskForUI} from "../dto/task-db-dto";
import { getTasks, isTaskDone } from "./task-service"
import * as fs from 'fs/promises';
import path from 'path';
import type { Task, TaskInfo } from "../model/task";
import { logger } from "../config/app/logger-config";
import ServerConfig from "../config/app/server-config";
import TaskType from "../common/task-types";
import { BotManager } from "../telegram/bot-manager";


export const tryCompleteTask = async(tgGuid: string, taskId : number): Promise<{ success: boolean; energyReward?: number }> => {
    let tasksDb: UserTaskForUI[] = await getTasks(tgGuid, AppLanguage.EN) as UserTaskForUI[];

    const foundTask = tasksDb.find(task => Number(task.task_id) === Number(taskId)) as unknown as UserTaskForUI;
    let reward = 0
    if(foundTask != undefined){
        reward = foundTask.energy_reward
    }
    if (!foundTask) {
        return { success: false };
    }

    if(foundTask.task_type == TaskType.TELEGRAM){
        let isSubscribe : boolean = await BotManager.isUserSubscribed(tgGuid as unknown as number);
        console.log('subscription', isSubscribe)
        if(!isSubscribe){
            { success: false };
        }
    }
    if (await isTaskDone(foundTask.date_completed,foundTask.is_daily)) {
        return { success: false };
    }
    return { success: true, energyReward: reward}
}
export const initializeStartTasks = async() => {
    let tasksCount : number | null = await getTaskCount();
    if(tasksCount == null || tasksCount == 0){
        try {
            const filePath = path.resolve(__dirname, ServerConfig.taskInitPathFile);
            const rawData = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(rawData);

    
    
            jsonData.forEach(async (task: any) => {
                const taskObj: Task = {
                    id: 0,
                    is_daily: task.is_daily,
                    energy_reward: task.energy_reward,
                    link: task.link,
                    task_type: task.task_type,
                    task_available: task.task_available,
                };
    
                let savedTaskId = await saveTask(taskObj) as unknown as number;
                task.info.forEach(async (info: any) => {
                    const taskInfoObj: TaskInfo = {
                        id: 0,
                        task_id: savedTaskId,
                        app_language: info.app_language,
                        title: info.title,
                        task_description: info.task_description,
                    };
                    await saveTaskInfo(taskInfoObj);
                });
    
            });
    
        } catch (error) {
            logger.error('Ошибка при загрузке задач из файла:', error);
            throw error;
        }
    }
}