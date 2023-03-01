import { ContextType, ConversationType } from '../types';
import { PaymentStages, KeyboardMarkup, ErrorLocales } from '../config';
import {
  toFixedNumber, escapeChars, isNumeric, replaceComma, getPercentageOfNumber,
} from '../utils';
import { BROKER_PERCENT } from '../config/contstants';
import { getUser } from '../db';

const Payment = async (conversation: ConversationType, ctx: ContextType) => {
  const stages = PaymentStages;
  const chatId = ctx.chat?.id as number;
  const user = await getUser(ctx.from.id);
  const { settings, unionPayRate } = user;
  const { rate } = settings.boughtRate || { rate: 0 };

  let current = stages[0];
  let exchangeRate = rate;
  let THB = 0;
  let CNY = 0;
  let lastUserMessageId = 0;

  while (stages.some((stage) => stage.stage === current?.stage)) {
    // breaks 2th stage if we have exchange rate in db
    if (exchangeRate && current.stage === 2) {
      current = stages[current.stage];
      continue;
    }

    await ctx.replyWithMarkdown(current.message, { reply_markup: current.reply_markup });

    const context = await conversation.wait();

    const message = replaceComma(context?.update?.message?.text) as unknown as number;
    if (message) {
      lastUserMessageId = context?.update?.message?.message_id;
    }

    // not a number
    if (message && !isNumeric(message as unknown as string) && !context?.update?.callback_query?.data) {
      context.deleteMessage();
      await ctx.replyWithMarkdown(escapeChars(ErrorLocales.NOT_NUMBER));
      continue;
    }

    // complaint back button
    if (/back/.test(context?.update?.callback_query?.data)) {
      ctx.api.deleteMessage(chatId, lastUserMessageId);
      context.deleteMessage();

      current = stages[current.stage - 2];
      continue;
    }

    if (current.stage === 1) {
      THB = message;
    } else if (current.stage === 2) {
      exchangeRate = message;
    } else if (current.stage === 3) {
      CNY = message;
    }

    current = stages[current.stage];
  }

  const resultSum = toFixedNumber(unionPayRate.target.rate * THB, 2);

  const exchangeRateWithBrokerFee = toFixedNumber(Number(exchangeRate) + getPercentageOfNumber(exchangeRate, BROKER_PERCENT), 4);

  const escapedText = escapeChars(`
      ${!unionPayRate.hasActualRate ? '❗️ *Курс на текущий день ещё не установлен, расчёты по курсу предыдущего дня* ❗️\n' : ''}
      \nИтоговая сумма покупки: *${resultSum} CNY* 🇨🇳 или *${toFixedNumber(resultSum * exchangeRateWithBrokerFee, 2)} RUB* 🇷🇺
      \nКурс обмена *RUB -> THB*: *${toFixedNumber((resultSum * exchangeRateWithBrokerFee) / THB, 4)}*
      \nНа карту вернут: *${toFixedNumber(CNY - resultSum, 2)} CNY* 🇨🇳 или *${toFixedNumber((CNY - resultSum) * exchangeRateWithBrokerFee, 2)} RUB* 🇷🇺`);

  await ctx.replyWithMarkdown(escapedText, { reply_markup: KeyboardMarkup.moreInfo });

  const nextContext = await conversation.wait();

  if (/more_info/.test(nextContext?.update?.callback_query?.data)) {
    const escapedMore = escapeChars(`
      \nЗаморежено *${CNY} CNY* 🇨🇳 по курсу *RUB -> THB*: *${toFixedNumber((CNY * exchangeRateWithBrokerFee) / THB, 4)}*`);

    await ctx.replyWithMarkdown(escapedMore);
  }
};

export { Payment };
