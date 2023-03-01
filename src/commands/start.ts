/* eslint-disable no-useless-escape */
/* eslint-disable no-tabs */
import { ContextType } from '../types';
import { KeyboardMarkup } from '../config';
import { BROKER_PERCENT } from '../config/contstants';
import { getUnionPayExchangeRate, getOtherExchangeRates } from '../api';
import { saveOrUpdateUser, getUser } from '../db';
import { IRate } from '../models/UserSchema';
import {
  getHumanizedDateRate,
  getTodayDate,
  escapeChars,
  hasActualRate,
  toFixedNumber,
  getPercentageOfNumber,
  isOutdated,
} from '../utils';

const getRUBTHB = (exchangeRate: number, unionPayRate: number) => {
  const resultSum = toFixedNumber(unionPayRate * 100, 2);

  const exchangeRateWithBrokerFee = toFixedNumber(Number(exchangeRate) + getPercentageOfNumber(exchangeRate, BROKER_PERCENT), 4);
  return toFixedNumber((resultSum * exchangeRateWithBrokerFee) / 100, 4);
};

const useStartCommand = async (ctx: ContextType) => {
  const user = await getUser(ctx.from.id);

  if (!user) {
    await saveOrUpdateUser({
      id: ctx.from.id,
      chat_id: ctx.chat.id,
      username: ctx.from.username,
      settings: {
        boughtRate: {
          rate: 0,
          date: '',
        },
      },
      unionPayRate: {
        target: {
          date: '',
          rate: 0,
        },
        prev: {
          date: '',
          rate: 0,
        },
        lastModified: 0,
        hasActualRate: false,
      },
    });
  }

  const isOutdatedUnionPayRate = !user?.unionPayRate.target.rate || isOutdated(user?.unionPayRate.lastModified);

  console.log('isOutdatedUnionPayRate', isOutdatedUnionPayRate);

  const callback = (targetUnion: IRate, prevUnion: IRate, boughtRate: IRate) => {
    const RUBTHB = getRUBTHB(boughtRate?.rate, targetUnion.rate) || 0;

    ctx.replyWithMarkdown(
      `🔸*Курс обмена THB 🇹🇭 \\-\\> CNY 🇨🇳 \\([UnionPay](https://m\\.unionpayintl\\.com/pre-sg/rate/)\\)*
        \n${escapeChars(`${getHumanizedDateRate(targetUnion)} (__текущий__)`)}
        \n${escapeChars(getHumanizedDateRate(prevUnion))}
        ${RUBTHB ? escapeChars(`\n🔸*Безналичный курс RUB 🇷🇺 -> THB 🇹🇭* : *${RUBTHB}*`) : ''}
        \n${escapeChars('*Основные команды:* \n/start - запустить \n/help - помощь по боту \n/settings - настройки')}`,
      { reply_markup: KeyboardMarkup.start },
    );
  };

  if (isOutdatedUnionPayRate) {
    const today = getTodayDate();
    const unionPayRaw = await getUnionPayExchangeRate(today);
    if (!unionPayRaw) {
      return;
    }
    const [targetRate, prevRate] = unionPayRaw;
    await saveOrUpdateUser({
      id: ctx.from.id,
      unionPayRate: {
        target: targetRate,
        prev: prevRate,
        lastModified: Date.now(),
        hasActualRate: hasActualRate(targetRate),
      },
    });

    callback.call(this, targetRate, prevRate, user?.settings.boughtRate);
  } else {
    callback(user.unionPayRate.target, user.unionPayRate.prev, user.settings.boughtRate);
  }
};

export { useStartCommand };
