import { ContextType } from '../types';
import { KeyboardMarkup } from '../config';
import { escapeChars } from '../utils';
import { getUser } from '../db';

const useSettingsCommand = async (ctx: ContextType) => {
  const user = await getUser(ctx.from.id);
  const { rate, date } = user?.settings.boughtRate || { rate: 0, date: '' };

  const escapedText = escapeChars(`
*Курс покупки RUB 🇷🇺 -> CNY* 🇨🇳
\n${rate && date ? `*${rate}* _(${date})_` : '_Не установлен_'}
`);
  await ctx.replyWithMarkdown(escapedText, { reply_markup: KeyboardMarkup.settings });
};

export { useSettingsCommand };
