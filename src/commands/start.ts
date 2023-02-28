/* eslint-disable no-tabs */
import { ContextType } from '../types';
import { KeyboardMarkup } from '../config';
import { getUnionPayExchangeRate, getOtherExchangeRates } from '../api';
import {
  getHumanizedDateRate,
  getTodayDate,
  escapeChars,
  hasActualRate,
} from '../utils';

const useStartCommand = async (ctx: ContextType) => {
  const today = getTodayDate();
  const unionPayRaw = await getUnionPayExchangeRate(today);

  if (!unionPayRaw) {
    return;
  }

  const [targetRate, prevRate] = unionPayRaw;

  ctx.session.unionPayRate.target = targetRate;
  ctx.session.unionPayRate.prev = prevRate;
  ctx.session.hasActualRate = hasActualRate(targetRate);

  ctx.replyWithMarkdown(
    `*Курс обмена THB 🇹🇭 \\-\\> CNY 🇨🇳 \\([UnionPay](https://m\\.unionpayintl\\.com/pre-sg/rate/)\\)*
			\n${escapeChars(`${getHumanizedDateRate(targetRate)} (__текущий__)`)}
			\n${escapeChars(getHumanizedDateRate(prevRate))}
      \n*Основные команды:*\n/start \\- запустить \n/help \\- помощь по боту`,
    { reply_markup: KeyboardMarkup.start },
  );
};

export { useStartCommand };
