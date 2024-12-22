import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import * as fs from 'fs'

const LoggerConf = {
    dirPath: process.env.LOGS_DIR_PATH || 'logs/',
    devMode: process.env.LOGGER_DEV_MODE === 'true',
}

if (!fs.existsSync(LoggerConf.dirPath)) {
    fs.mkdirSync(LoggerConf.dirPath, { recursive: true })
}

const transportError = new DailyRotateFile({
    filename: `${LoggerConf.dirPath}/error-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
})

const transportDebug = new DailyRotateFile({
    filename: `${LoggerConf.dirPath}/debug-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'debug',
})

const transportWarn = new DailyRotateFile({
    filename: `${LoggerConf.dirPath}/warn-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'warn',
})

const transportInfo = new DailyRotateFile({
    filename: `${LoggerConf.dirPath}/info-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
})

const transportsArray = [
    transportError,
    transportDebug,
    transportWarn,
    transportInfo,
]

if (LoggerConf.devMode) {
    transportsArray.push(new transports.Console())
}

export const logger = createLogger({
    level: 'debug',
    format: format.combine(format.timestamp(), format.json()),
    transports: transportsArray,
})
