import { config } from 'dotenv';
import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { closeConnection } from './db';

import { ContextType } from './types';
import { KeyboardLocales } from './config';
import { Payment, Withdrawal } from './conversations';
import { error } from './middlewares/error';
import startServer from './server';
import {
  useStartCommand, useHelpCommand, useHelpPaymentCallback, useHelpWithdrawalCallback, useHelpSettingsCallback,
} from './commands';

config();

const { BOT_TOKEN, PORT } = process.env;

const bot = new Bot<ContextType>(BOT_TOKEN || '');

bot.use(session({
  initial: () => ({
    unionPayRate: {
      target: 0,
      prev: 0,
    },
    isWeekday: false,
  }),
}));

bot.use(error);
bot.use(conversations());
bot.use(hydrateReply);

bot.use(createConversation(Payment, 'payment'));
bot.use(createConversation(Withdrawal, 'withdrawal'));

// Sets default parse_mode for ctx.reply
bot.api.config.use(parseMode('MarkdownV2'));
bot.api.setMyCommands([
  { command: 'start', description: 'Узнать курс обмена' },
  { command: 'help', description: 'Помощь' },
  { command: 'settings', description: 'Настройки' },
]);

bot.command('start', async (ctx) => {
  await useStartCommand(ctx);
});

bot.command('help', async (ctx) => {
  await useHelpCommand(ctx);
});

bot.callbackQuery('help_payment', async (ctx: ContextType) => useHelpPaymentCallback(ctx));

bot.callbackQuery('help_withdrawal', async (ctx: ContextType) => useHelpWithdrawalCallback(ctx));

bot.callbackQuery('help_settings', async (ctx: ContextType) => useHelpSettingsCallback(ctx));

bot.on('message:text', async (ctx) => {
  const { text } = ctx.msg;

  if (text === KeyboardLocales.PAYMENT) {
    await ctx.conversation.enter('payment');
  }

  if (text === KeyboardLocales.WITHDRAW) {
    await ctx.conversation.enter('withdrawal');
  }
});

async function startup() {
  await bot.start({
    onStart(botInfo) {
      console.log(new Date(), 'Bot starts as', botInfo.username);
    },
  });
}

startServer(PORT || '5000');

startup();

// Bind commands

process.once('SIGINT', () => {
  closeConnection()
    .then(() => console.log('SIGINT occurred, exiting'))
    .catch(() => console.log('SIGINT occurred, exiting with no db connection closed'));
});
process.once('SIGTERM', () => {
  closeConnection()
    .then(() => console.log('SIGTERM occurred, exiting'))
    .catch(() => console.log('SIGTERM occurred, exiting with no db connection closed'));
});

// connectDB()
//   .then(() => bot.start())
//   .catch((err) => console.log(err));
