/* eslint-disable no-tabs */
import { ContextType } from '../types';
import { KeyboardMarkup } from '../config';
import { getUnionPayExchangeRate, getOtherExchangeRates } from '../api';
import {
  isTodayDate, isYesterdayDate, formatDate, escapeChars,
} from '../utils';

const useStartCommand = async (ctx: ContextType) => {
  const unionPayRaw = await getUnionPayExchangeRate();
  if (!unionPayRaw) {
    return;
  }

  const [targetRate, prevRate] = unionPayRaw;
  let targetText = 'Сегодня - *не установлен*';
  let prevText = '';

  if (typeof targetRate === 'object' && !Array.isArray(targetRate) && targetRate !== null) {
    const { date, rate } = targetRate;
    targetText = isTodayDate(date) ? `Сегодня - *${rate}*` : `${formatDate(date)} - *${rate}*`;

    ctx.session.unionPayRate.target = rate;
  }

  if (typeof prevRate === 'object' && !Array.isArray(prevRate) && prevRate !== null) {
    const { date, rate } = prevRate;
    prevText = isYesterdayDate(date) ? `Вчера - *${rate}*` : `${formatDate(date)} - *${rate}*`;

    ctx.session.unionPayRate.prev = rate;
  }

  ctx.replyWithMarkdown(
    `*Курс обмена THB 🇹🇭 \\-\\> CNY 🇨🇳 \\([UnionPay](https://m\\.unionpayintl\\.com/pre-sg/rate/)\\)*
			\n${escapeChars(targetText)}
			\n${escapeChars(prevText)}
      \n*Основные команды:*\n/start \\- запустить \n/help \\- помощь по боту`,
    { reply_markup: KeyboardMarkup.start },
  );
};

export { useStartCommand };
