import { ContextType } from '../types';
import { escapeChars } from '../utils';
import { KeyboardMarkup } from '../config';
import { useHelpPaymentCallback } from './help/helpPayment';
import { useHelpWithdrawalCallback } from './help/helpWithdrawal';
import { useHelpSettingsCallback } from './help/helpSettings';

const useHelpCommand = async (ctx: ContextType) => {
  const escapedText = escapeChars(`
  Бот помогает определить текущий кросс-курс *RUB -> THB* через *CNY* на снятие/покупку.
  \n 🚀 Предложения и замечания по расчётам: @dashqa 🚀
  \n❗️Только для владельцев карт UnionPay в валюте *юань* банка *Газпромбанк*, которые покупают юань у *Брокер Банк ГПБ (АО)*.
  \n❗️Не путать с *Газпром Инвестиции*❗️
  \n Бот делался для себя, поэтому расширение функционала и распространение на другие банки/валюты *не планируется*.
  \n\n*Помощь по разделам:*
  `);

  await ctx.replyWithMarkdown(escapedText, { reply_markup: KeyboardMarkup.help });
};

export {
  useHelpCommand,
  useHelpPaymentCallback,
  useHelpWithdrawalCallback,
  useHelpSettingsCallback,
};
