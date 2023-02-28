import { UnionPayExchangeRateType } from './types';
declare const toFixedNumber: (num: number, fix: number) => number;
declare const escapeChars: (str: string) => string;
declare const getPercentageOfNumber: (num: number, percent: number) => number;
declare const replaceComma: (str: string) => string;
declare const isNumeric: (num: string) => boolean;
declare const isTodayDate: (date: string) => boolean;
declare const isYesterdayDate: (date: string) => boolean;
declare const formatDate: (date: string) => string;
declare const isWeekendDate: (timestamp: number) => boolean;
declare const getTodayDate: () => string;
declare const getPrevDate: (date: string) => string;
declare const getHumanizedDateRate: ({ date, rate }: {
    date: string;
    rate: number;
}) => string;
declare const hasActualRate: (targetRate: UnionPayExchangeRateType) => boolean;
declare const formatTextToEqualBlockWidth: (string: string) => string;
export { toFixedNumber, escapeChars, replaceComma, isNumeric, isTodayDate, isYesterdayDate, isWeekendDate, formatDate, hasActualRate, getPercentageOfNumber, getTodayDate, getPrevDate, getHumanizedDateRate, formatTextToEqualBlockWidth, };
//# sourceMappingURL=utils.d.ts.map