import ServerConfig from "../config/app/server-config"

export const generatePathToStaticContent = async(imageName : string) => {
    return ServerConfig.staticPathForServer + imageName;
}