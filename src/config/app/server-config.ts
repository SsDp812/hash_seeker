const ServerConfig = {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT as unknown as number,
    staticFilesPathForInit: process.env.STATIC_FILE_PATH_FOR_START_INIT as string
}
export default ServerConfig
