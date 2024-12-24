import { getAllImages, saveNewImage, getRandomImageId } from "../db/image-repository"
import { getAllInstancesByUserGuid,createImageUserInstance, setActiveImage} from "../db/image-instance-repository";
import type { ImageAvatar } from "../model/image";
import type { ImageIntance } from "../model/image-instance";
import type { ImagerDto } from "../dto/image-dto";
import fs from 'fs';
import path from 'path';
import ServerConfig from "../config/app/server-config";
import { logger } from "../config/app/logger-config";
import { getLatestTaskInstance, saveTaskInstance } from "../db/tasks-repository";
import type { AppLanguage } from "../common/app-languages";
import type { UserTaskForUI, UserTaskInfoFromDb } from "../dto/task-db-dto";
import { tryCompleteTask } from "./task-manager";
import type { TaskInstance } from "../model/task-instance";
import { searchByTgGuid } from "../db/user-repository";
import type { User } from "../model/user";
import type { Task } from "../model/task";
import { chargeWallet } from "../db/wallet-reposiory";
import { OrderPrices } from "../config/mechanic/order-prices-config";



export const getTasks = async(tgGuid : string, lang : AppLanguage) => {
    let dbTasks : UserTaskInfoFromDb[] = await getLatestTaskInstance(tgGuid, lang) as unknown as UserTaskInfoFromDb[];
    let uiTasks : UserTaskForUI[] = []
    dbTasks.forEach(async dbTask =>{
        uiTasks.push(
            {
                ...dbTask,
                isDone: await isTaskDone(dbTask.date_completed,dbTask.is_daily)
            }
        )
    })
    return uiTasks;
}

export const isTaskDone = async (
    dateCompleted: Date | null | undefined,
    isDaily: boolean
): Promise<boolean> => {
    if (dateCompleted && !isDaily) {
        return true;
    }
    if (!dateCompleted) {
        return false;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const completedDate = new Date(
        dateCompleted.getFullYear(),
        dateCompleted.getMonth(),
        dateCompleted.getDate()
    );

    return completedDate >= today;
};

export const completeTask = async (tgGuid: string, taskId : number): Promise<boolean> => {
    let result = await tryCompleteTask(tgGuid,taskId);
    if(!result.success){
        return false;
    }
    let user : User = await searchByTgGuid(tgGuid) as User;
    if(user == null || user == undefined){
        return false;
    }
    let taskInstance : TaskInstance = {
        id: 0,
        task_id: taskId,
        user_id: user.id,
        user_tg_guid: tgGuid,
        date_completed: new Date(),
        energy_reward_catched: result.energyReward as number
    }
    try{
        await saveTaskInstance(taskInstance);
        await chargeWallet(user.id,result.energyReward as number);
    }catch(error){
        logger.error(error)
        return false;
    }
    return true;
};