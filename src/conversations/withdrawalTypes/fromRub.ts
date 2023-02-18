import {
  escapeChars, isNumeric, toFixedNumber, getPercentageOfNumber, replaceComma,
} from '../../utils';
import { ContextType, ConversationType, ConversationStageType } from '../../types';
import { ErrorLocales } from '../../config/locales';
import { KeyboardMarkup } from '../../config/keyboardMarkup';
import {
  BROKER_PERCENT, BANK_PERCENT, ATM_COMISSION, APPROXIMATE_FROZE_PERCENT,
} from '../../config/contstants';

const useWithdrawalFromRub = async (
  conversation: ConversationType,
  ctx: ContextType,
  stages: ConversationStageType[],
  chatId: number,
  unionPayTargetRate: number,
): Promise<void> => {
  let current = stages[0];
  let exchangeRate = 0;
  let RUB = 0;
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
      RUB = message;
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

      const boughtCNY = toFixedNumber(RUB / exchangeRate, 1); // получено на карту от брокера
      const gotCNY = toFixedNumber(boughtCNY - getPercentageOfNumber(boughtCNY, BROKER_PERCENT), 2);

      const cashCNY = toFixedNumber(
        gotCNY - getPercentageOfNumber(gotCNY, BANK_PERCENT) - (isInludesATMCommission ? ATM_COMISSION * unionPayTargetRate : 0),
        2,
      ); // если снимаем в ATM
      const THB = toFixedNumber(cashCNY / unionPayTargetRate, 2); // на руках в THB
      const FINALRATE = toFixedNumber(RUB / THB, 4); // итоговый курс снятия в ATM

      const THBcashless = toFixedNumber(gotCNY / unionPayTargetRate, 2); // если платить только картой в THB
      const cashlessRate = toFixedNumber((gotCNY * exchangeRate) / THBcashless, 4); // безналичный курс

      const diffCNY = toFixedNumber(gotCNY - cashCNY, 2);
      const diffTHB = toFixedNumber(diffCNY / unionPayTargetRate, 2);
      const diffRUB = toFixedNumber(diffCNY * exchangeRate, 2);

      const escapedText = escapeChars(`
      \nПоступления на карту от Брокера: *${gotCNY} CNY* 🇨🇳
      \nСнятие в ATM: *${cashCNY} CNY* 🇨🇳 или *${THB} THB* 🇹🇭
      \nКурс снятия *RUB -> THB*: *${FINALRATE}*
      \nP.S. Нужно учитывать, что банк заморозит CNY 🇨🇳 на *≈${APPROXIMATE_FROZE_PERCENT}%* больше от суммы операции. Если Вам нужно снять *${cashCNY} CNY* 🇨🇳, то на карте должно быть *≈${toFixedNumber(cashCNY + getPercentageOfNumber(cashCNY, APPROXIMATE_FROZE_PERCENT), 2)} CNY* 🇨🇳
      `);

      await ctx.replyWithMarkdown(escapedText, { reply_markup: KeyboardMarkup.moreInfo });

      const nextContext = await conversation.wait();

      if (/more_info/.test(nextContext?.update?.callback_query?.data)) {
        const escapedMore = escapeChars(`
      \nЕсли платить только картой: *${gotCNY} CNY* 🇨🇳 или *${THBcashless} THB* 🇹🇭
      \nБезналичный курс *RUB -> THB*: *${cashlessRate}*
      \nПотери если снимать в АТМ, а не платить картой:\n *${diffCNY} CNY* 🇨🇳 или *${toFixedNumber(diffTHB, 2)} THB* 🇹🇭 или *${diffRUB} RUB* 🇷🇺
      `);

        await ctx.replyWithMarkdown(escapedMore);
      }

      return;
    }

    current = stages[current.stage];
  }
};

export { useWithdrawalFromRub };
