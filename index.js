const TelegramApi = require("node-telegram-bot-api");

const token = "5728642524:AAERFTeGIg4ooLthtDp5MGrt89gqDYlt2K8";

const bot = new TelegramApi(token, { polling: true });

const {gameOptions, againOptions} = require('./options.js');

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Я загадаю число от 0 до 9, а ты попробуй отгадать"
  );
  const randomNum = Math.floor(Math.random() * 10);
  chats[chatId] = randomNum;
  await bot.sendMessage(chatId, "Попробуй! Выбери это число", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { commaind: "/start", description: "Начальное приветствие" },
    { commaind: "/info", description: "Информация о пользователе" },
    { commaind: "/game", description: "Угадай число" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/96/9.webp"
      );
      return bot.sendMessage(chatId, "Добро пожаловать, мой дорогой друг");
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
        return startGame(chatId)
    }
    return bot.sendMessage(
      chatId,
      "Я тебя не понимаю, попробуй написать что-то другое"
    );
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
       return startGame(chatId)
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению пластмассовый мир победил, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
