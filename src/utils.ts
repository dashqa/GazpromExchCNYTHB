import {
  format, previousFriday, isWeekend, subDays, isToday,
  setDefaultOptions,
  isMonday,
  isBefore,
  isAfter,
  isYesterday,
} from 'date-fns';
import { ru } from 'date-fns/locale';

setDefaultOptions({ locale: ru });

const toFixedNumber = ((num: number, fix: number): number => Number(num.toFixed(fix)));

const escapeChars = ((str: string): string => str.replace(/[-/\\^$+><?.()|[\]{}]/g, '\\$&'));

const getPercentageOfNumber = ((num: number, percent: number): number => (num / 100) * percent);

const isNumeric = (num: string): boolean => {
  const str = num.replaceAll(',', '.').replaceAll(' ', '').trim();
  // eslint-disable-next-line no-restricted-globals
  return str !== '' && !isNaN(str as unknown as number);
};

const isTodayDate = (date: string): boolean => isToday(new Date(date));

const isYesterdayDate = (date: string): boolean => isYesterday(new Date(date));

const formatDate = (date: string): string => format(new Date(date), 'd MMMM');

const getPayloadDates = (): { target: string, prev?: string } => {
  const now = new Date();
  const FORMAT = 'yyyyMMdd';
  // it's weekend or monday before 16:00
  if (isWeekend(now) || (isMonday(now) && isBefore(now, new Date().setHours(16, 0, 0)))) {
    return {
      target: format(previousFriday(now), FORMAT),
      prev: null,
    };
  }

  // it's monday after 16:00
  if (isMonday(now) && isAfter(now, new Date().setHours(16, 0, 0))) {
    return {
      target: format(now, FORMAT),
      prev: format(previousFriday(now), FORMAT),
    };
  }

  return {
    target: format(now, FORMAT),
    prev: format(subDays(now, 1), FORMAT),
  };
};

const getPrevDate = (date: string): string => {
  const now = new Date(date);
  const FORMAT = 'yyyyMMdd';
  return format(subDays(now, 1), FORMAT);
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
  isNumeric,
  isTodayDate,
  isYesterdayDate,
  formatDate,
  getPercentageOfNumber,
  getPayloadDates,
  getPrevDate,
  formatTextToEqualBlockWidth,
};
