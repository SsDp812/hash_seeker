const BotConfig = {
    botAuthChecking: process.env.BOT_AUTH_CHECKING === 'true',
    botToken: process.env.BOT_TOKEN as string,
    botAuthLimit: process.env.BOT_AUTH_TIME_LIMIT === 'true',
    botAuthTime: Number(process.env.BOT_AUTH_TIME_SECONDS),
}
export default BotConfig
