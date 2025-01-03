const ServerConfig = {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT as unknown as number,
    staticFilesPathForInit: process.env.STATIC_FILE_PATH_FOR_START_INIT as string,
    staticPathForServer: process.env.STATIC_PATH_FOR_SERVER as string,
    taskInitPathFile: process.env.TASKS_FILE_FOR_START_INIT as string
}
export default ServerConfig
