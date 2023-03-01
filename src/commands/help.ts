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
  \nКурс обмена *UnionPay* обновляется по рабочим дням в 16:00 (GMT +7). В выходные и будние до 16:00 (GMT +7) курс *UnionPay* будет равен курсу предыдущего рабочего дня.
  \n❗️*ВНИМАНИЕ*❗️
  \nФраза *«❗️Курс на текущий день ещё не установлен, расчёты по курсу предыдущего дня»* означает, что на сегодня ещё нет обновления курса *UnionPay*, информация *НЕ СОВПАДЁТ* с выпиской банка, а представлена лишь для примерного понимания.
  \nКурс покупки *RUB -> CNY* указать нужно прям как в истории операций Брокера, *НЕ НАДО* добавлять комиссии в курс.
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
