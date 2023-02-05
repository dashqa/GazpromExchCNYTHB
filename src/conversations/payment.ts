import { ContextType, ConversationType } from '../types';
import { PaymentStages, KeyboardMarkup, ErrorLocales } from '../config';
import { toFixedNumber, escapeChars, isNumeric } from '../utils';

const Payment = async (conversation: ConversationType, ctx: ContextType) => {
  const stages = PaymentStages;
  const chatId = ctx.chat?.id as number;
  const { unionPayRate } = ctx.session;

  let current = stages[0];
  let exchangeRate = 0;
  let THB = 0;
  let CNY = 0;
  let lastUserMessageId = 0;

  while (stages.some((stage) => stage.stage === current.stage)) {
    await ctx.replyWithMarkdown(current.message, { reply_markup: current.reply_markup });

    const context = await conversation.wait();

    const message = context?.update?.message?.text as unknown as number;
    if (message) {
      lastUserMessageId = context?.update?.message?.message_id;
    }

    if (message && !isNumeric(message as unknown as string) && !context?.update?.callback_query?.data) {
      context.deleteMessage();
      await ctx.replyWithMarkdown(escapeChars(ErrorLocales.NOT_NUMBER));
      continue;
    }

    // complaint back btn
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
    } else if (current.stage === 4) {
      let correctSum: number;

      if (/before_4pm/.test(context?.update?.callback_query?.data)) {
        correctSum = toFixedNumber(unionPayRate.prev * THB, 2);
      }

      if (/after_4pm/.test(context?.update?.callback_query?.data)) {
        correctSum = toFixedNumber((unionPayRate.target || unionPayRate.prev) * THB, 2);
      }

      const escapedText = escapeChars(`
      Итоговая сумма покупки: *${correctSum} CNY* 🇨🇳 или *${toFixedNumber(correctSum * exchangeRate, 2)} RUB* 🇷🇺
      \nКурс обмена *RUB -> THB*: *${toFixedNumber((correctSum * exchangeRate) / THB, 4)}*
      \nНа карту вернут: *${toFixedNumber(CNY - correctSum, 2)} CNY* 🇨🇳 или *${toFixedNumber((CNY - correctSum) * exchangeRate, 2)} RUB* 🇷🇺`);

      await ctx.replyWithMarkdown(escapedText, { reply_markup: KeyboardMarkup.moreInfo });

      const nextContext = await conversation.wait();

      if (/more_info/.test(nextContext?.update?.callback_query?.data)) {
        const escapedMore = escapeChars(`
      \nЗаморежено *${CNY} CNY* 🇨🇳 по курсу *RUB -> THB*: *${toFixedNumber((CNY * exchangeRate) / THB, 4)}*`);

        await ctx.replyWithMarkdown(escapedMore);
      }

      return;
    }

    current = stages[current.stage];
  }
};

export { Payment };
