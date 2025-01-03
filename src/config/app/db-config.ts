import postgres from 'postgres'

const dbProps = {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
}

const sql = postgres(
    'postgresql://' +
        dbProps.dbUser +
        ':' +
        dbProps.dbPassword +
        '@' +
        dbProps.dbHost +
        ':' +
        dbProps.dbPort +
        '/' +
        dbProps.dbName,
        {
            max: process.env.DB_MAX_POOL_SIZE as unknown as number,
            idle_timeout: process.env.DB_TIMEOUT as unknown as number
        }
)

export default sql
