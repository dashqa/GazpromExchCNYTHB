import {
  format, previousFriday, isWeekend, subDays, isToday,
  setDefaultOptions,
  isMonday,
  isBefore,
  isAfter,
  isYesterday,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { UnionPayExchangeRateType } from './types';

setDefaultOptions({ locale: ru });

const toFixedNumber = ((num: number, fix: number): number => Number(num.toFixed(fix)));

const escapeChars = ((str: string): string => str.replace(/[-/\\^$+><?.()|[\]{}]/g, '\\$&'));

const getPercentageOfNumber = ((num: number, percent: number): number => (num / 100) * percent);

const replaceComma = (str: string): string => str && str.replaceAll(',', '.').replaceAll(' ', '').trim();

// eslint-disable-next-line no-restricted-globals
const isNumeric = (num: string): boolean => num !== '' && !isNaN(num as unknown as number);

const isTodayDate = (date: string): boolean => isToday(new Date(date));

const isYesterdayDate = (date: string): boolean => isYesterday(new Date(date));

const formatDate = (date: string): string => format(new Date(date), 'd MMMM');

const isWeekendDate = (timestamp: number): boolean => isWeekend(new Date(timestamp));

// const isMondayBefore4pm = (timestamp: number): boolean => {
//   const timstamp = new Date(timestamp);
//   return isMonday(timstamp) && isBefore(timstamp, new Date(timstamp).setHours(15, 30, 0));
// };

const getTodayDate = (): string => {
  const now = new Date();
  const FORMAT = 'yyyy-MM-dd';
  return format(now, FORMAT);
};

const getPrevDate = (date: string): string => {
  const now = new Date(date);
  const FORMAT = 'yyyy-MM-dd';
  return format(subDays(now, 1), FORMAT);
};

const getHumanizedDateRate = ({ date, rate }: { date: string, rate: number }): string => {
  if (isTodayDate(date)) {
    return `Сегодня - *${rate}*`;
  }
  if (isYesterdayDate(date)) {
    return `Вчера - *${rate}*`;
  }
  return `${formatDate(date)} - *${rate}*`;
};

const hasActualRate = (targetRate: UnionPayExchangeRateType): boolean => {
  if (!targetRate) {
    return false;
  }

  const now = Date.now();
  if (isWeekendDate(now)) {
    return true;
  }

  return targetRate.date === getTodayDate();
};

const formatTextToEqualBlockWidth = (string: string) => {
  const nullSeparator = '&#x200D;';
  const maxNumberOfSymbol = 40;
  const resultStringArray = [];

  while (string.length) {
    let partOfString = string.substring(0, maxNumberOfSymbol).trim();
    let positionOfCarriageTransfer = string.length < maxNumberOfSymbol ? string.length : partOfString.lastIndexOf(' ');
    positionOfCarriageTransfer = positionOfCarriageTransfer === -1 ? partOfString.length : positionOfCarriageTransfer;
    partOfString = partOfString.substring(0, positionOfCarriageTransfer);
    partOfString = partOfString + new Array(maxNumberOfSymbol - partOfString.length).join(' ') + nullSeparator;
    resultStringArray.push(`<pre><strong>${partOfString}</strong></pre>`);
    // eslint-disable-next-line no-param-reassign
    string = string.substring(positionOfCarriageTransfer).trim();
  }
  return resultStringArray.join('\n');
};

export {
  toFixedNumber,
  escapeChars,
  replaceComma,
  isNumeric,
  isTodayDate,
  isYesterdayDate,
  isWeekendDate,
  formatDate,
  hasActualRate,
  getPercentageOfNumber,
  getTodayDate,
  getPrevDate,
  getHumanizedDateRate,
  formatTextToEqualBlockWidth,
};
