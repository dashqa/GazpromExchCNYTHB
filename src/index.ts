import { config } from 'dotenv';
import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { closeConnection, connectDB } from './db';

import { ContextType } from './types';
import { KeyboardLocales } from './config';
import {
  Payment, Withdrawal, SettingsUpdateRate, SettingsDeleteRate,
} from './conversations';
import { error } from './middlewares/error';
import startServer from './server';
import {
  useStartCommand,
  useSettingsCommand,
  useHelpCommand,
  useHelpPaymentCallback,
  useHelpWithdrawalCallback,
  useHelpSettingsCallback,
} from './commands';

config();

const {
  BOT_TOKEN,
  PORT,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB_NAME,
} = process.env;

const bot = new Bot<ContextType>(BOT_TOKEN || '');

bot.use(session({
  initial: () => ({}),
}));

bot.use(error);
bot.use(conversations());
bot.use(hydrateReply);

bot.use(createConversation(Payment, 'payment'));
bot.use(createConversation(Withdrawal, 'withdrawal'));
bot.use(createConversation(SettingsUpdateRate, 'settingsUpdateRate'));
bot.use(createConversation(SettingsDeleteRate, 'settingsDeleteRate'));

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

bot.command('settings', async (ctx) => {
  await useSettingsCommand(ctx);
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

  if (text === KeyboardLocales.SETTINGS) {
    await useSettingsCommand(ctx);
  }

  if (text === KeyboardLocales.SETTINGS_BACK_TO_MAIN) {
    await useStartCommand(ctx);
  }

  if (text === KeyboardLocales.SETTINGS_UPDATE_RATE) {
    await ctx.conversation.enter('settingsUpdateRate');
  }

  if (text === KeyboardLocales.SETTINGS_DELETE_RATE) {
    await ctx.conversation.enter('settingsDeleteRate');
  }
});

async function startup() {
  await bot.start({
    onStart(botInfo) {
      console.log(new Date(), 'Bot starts as', botInfo.username);
    },
  });
}

connectDB(MONGO_HOST, MONGO_PORT, MONGO_DB_NAME)
  .then(() => {
    startServer(PORT || '5000');
    startup();
  })
  .catch((err) => console.log(err));

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
