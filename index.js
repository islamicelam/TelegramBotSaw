
const TelegramApi = require ('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = "6147902399:AAG7PtBoril0L6-ZJPAbJlODCCaB9z_b0u8"

const bot = new TelegramApi (token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I'll pick a number from 0 to 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Now you have to guess it", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Greetings'},
        {command: '/info', description: 'Information'},
        {command: '/game', description: 'Game'}
    ])

    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === "/start") {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/a67/687/a67687d7-a192-4eec-a91c-96b36966ba89/4.webp')
            return bot.sendMessage(chatId, 'I want to play a game!')
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        console.log(msg)
        if (text === "/info") {
            return bot.sendMessage(chatId, `You don't know me, but I know you, ${msg.from.first_name}`)
        }

        return bot.sendMessage(chatId, 'Live or die, make your choice.')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg)

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Congratulations, you guessed the number - ${chats[chatId]}. Most people are so ungrateful to be alive.`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Wrong, I picked the number ${chats[chatId]}`, againOptions)
        }
    })
}

start()