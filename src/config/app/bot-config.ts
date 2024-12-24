import { subscribe } from "diagnostics_channel"

const BotConfig = {
    botAuthChecking: process.env.BOT_AUTH_CHECKING === 'true',
    botToken: process.env.BOT_TOKEN as string,
    botAuthLimit: process.env.BOT_AUTH_TIME_LIMIT === 'true',
    botAuthTime: Number(process.env.BOT_AUTH_TIME_SECONDS),
    subscribeChannel: process.env.CHECK_SUBSC_CHANNEL_NAME as string,
    botInviteLink: process.env.INVITE_LINK_TO_APP as string
}
export default BotConfig
