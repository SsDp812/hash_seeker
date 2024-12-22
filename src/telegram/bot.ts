import { Bot } from 'grammy'
import bot_config from '../config/app/bot_config.ts'

export const bot = new Bot(bot_config.botToken) // <-- put your bot token between the ""

const title = 'Balance top-up'
const description = 'Add balance to your account'
const payload = '{}'
const currency = 'XTR'
const prices = [{ amount: 1, label: title }]

export const invoiceLink = await bot.api.createInvoiceLink(
    title,
    description,
    payload,
    '', // Provider token must be empty for Telegram Stars
    currency,
    prices
)

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
// Handle other messages.

bot.on('pre_checkout_query', (ctx) => {
    return ctx.answerPreCheckoutQuery(true).catch(() => {
        console.error('answerPreCheckoutQuery failed')
    })
})

bot.on('message', (ctx) => {
    if (ctx.msg.successful_payment) {
        console.log(ctx.message)
    }
})
