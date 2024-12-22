const BotConfig = {
    botAuthChecking: process.env.BOT_AUTH_CHECKING === 'true',
    botToken: process.env.BOT_TOKEN as string,
    botAuthLimit: process.env.BOT_AUTH_TIME_LIMIT === 'true',
    botAuthTime: process.env.BOT_AUTH_TIME_SECONDS as unknown as number,
}
export default BotConfig
