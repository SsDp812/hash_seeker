import { app } from '../index.ts'
import { invoiceLink } from '../telegram/bot.ts'

app.post('/', (context: { body: any; headers: any }) => {
    return { message: 'Hello, world!' }
})

app.post('/get-hui-chlen', (context) => {
    return { invoiceLink: invoiceLink }
})
// писька сосиська
