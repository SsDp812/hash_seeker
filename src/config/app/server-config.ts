const ServerConfig = {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT as unknown as number,
    staticFilesPath: process.env.STATIC_FILE_PATH as string
}
export default ServerConfig
