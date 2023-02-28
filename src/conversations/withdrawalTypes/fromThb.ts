import { ContextType, ConversationType, ConversationStageType } from '../../types';
import { ErrorLocales } from '../../config';
import {
  escapeChars, isNumeric, getPercentageOfNumber, toFixedNumber, replaceComma,
} from '../../utils';
import {
  BANK_PERCENT, ATM_COMISSION, APPROXIMATE_FROZE_PERCENT, BROKER_PERCENT,
} from '../../config/contstants';

const useWithdrawalFromThb = async (
  conversation: ConversationType,
  ctx: ContextType,
  stages: ConversationStageType[],
  chatId: number,
  unionPayTargetRate: number,
  hasActualRate: boolean,
): Promise<void> => {
  let current = stages[0];
  let exchangeRate = 0;
  let needTHB = 0;
  let lastUserMessageId = 0;

  while (stages.some((stage) => stage.stage === current.stage)) {
    await ctx.replyWithMarkdown(current.message, { reply_markup: current.reply_markup });

    const context = await conversation.wait();
    const message = replaceComma(context?.update?.message?.text) as unknown as number;
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
      needTHB = message;
    } else if (current.stage === 2) {
      exchangeRate = message;
    } else if (current.stage === 3) {
      let isInludesATMCommission = false;
      if (/include_ATM_commission/.test(context?.update?.callback_query?.data)) {
        isInludesATMCommission = true;
      }

      if (/not_include_ATM_comission/.test(context?.update?.callback_query?.data)) {
        isInludesATMCommission = false;
      }

      const THB = Number(needTHB) + Number(isInludesATMCommission ? ATM_COMISSION : 0); // сумма в THB
      const withoutBankFee = toFixedNumber(unionPayTargetRate * THB, 2); // без комиссии банка в CNY

      const withFee = toFixedNumber(withoutBankFee + getPercentageOfNumber(withoutBankFee, BANK_PERCENT), 2); // с комиссией банка в CNY

      const exchangeRateWithBrokerFee = toFixedNumber(Number(exchangeRate) + getPercentageOfNumber(exchangeRate, BROKER_PERCENT), 4);

      const needRub = toFixedNumber(withFee * exchangeRateWithBrokerFee, 2); // нужно рублей
      const FINALRATE = toFixedNumber((withFee * exchangeRateWithBrokerFee) / needTHB, 4); // финальный курс RUB -> THB

      const escapedText = escapeChars(`
      ${!hasActualRate ? '❗️ *Курс на текущий день ещё не установлен, расчёты по курсу предыдущего дня* ❗️\n' : ''}
      \nИтоговая сумма: *${withFee} CNY* 🇨🇳 или *${needRub} RUB* 🇷🇺
      \nКурс снятия *RUB -> THB*: *${FINALRATE}*
      \nP.S. Нужно учитывать, что банк заморозит CNY 🇨🇳 на *≈${APPROXIMATE_FROZE_PERCENT}%* больше от суммы операции. Если Вам нужно снять *${withFee} CNY* 🇨🇳, то на карте должно быть *≈${toFixedNumber(withFee + getPercentageOfNumber(withFee, APPROXIMATE_FROZE_PERCENT), 2)} CNY* 🇨🇳
      `);

      await ctx.replyWithMarkdown(escapedText);
      // await ctx.replyWithMarkdown(escapedText, { reply_markup: KeyboardMarkup.moreInfo });

      // const nextContext = await conversation.wait();

      // if (/more_info/.test(nextContext?.update?.callback_query?.data)) {
      //   const escapedMore = escapeChars('');

      //   await ctx.replyWithMarkdown(escapedMore);
      // }

      return;
    }

    current = stages[current.stage];
  }
};

export { useWithdrawalFromThb };
