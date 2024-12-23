import { getAllImages, saveNewImage, getRandomImageId } from "../db/image-repository"
import { getAllInstancesByUserGuid,createImageUserInstance, setActiveImage} from "../db/image-instance-repository";
import type { ImageAvatar } from "../model/image";
import type { ImageIntance } from "../model/image-instance";
import type { ImagerDto } from "../dto/image-dto";
import fs from 'fs';
import path from 'path';
import ServerConfig from "../config/app/server-config";
import { logger } from "../config/app/logger-config";
import TasksRepository from "../db/tasks-repository.ts";


class TaskService {
    static async getUsualTasks (tgGuidId: string) {
        return await TasksRepository.getUsualTasksByUserID(tgGuidId)
    }

    static async getDailyTasks (tgGuidId: string) {
        return await TasksRepository.getDailyTasksByUserID(tgGuidId)
    }
}

export default TaskService