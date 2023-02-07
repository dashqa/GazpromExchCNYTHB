declare const toFixedNumber: (num: number, fix: number) => number;
declare const escapeChars: (str: string) => string;
declare const getPercentageOfNumber: (num: number, percent: number) => number;
declare const isNumeric: (num: string) => boolean;
declare const isTodayDate: (date: string) => boolean;
declare const isYesterdayDate: (date: string) => boolean;
declare const formatDate: (date: string) => string;
declare const getPayloadDates: () => {
    target: string;
    prev?: string;
};
declare const getPrevDate: (date: string) => string;
declare const formatTextToEqualBlockWidth: (string: string) => string;
export { toFixedNumber, escapeChars, isNumeric, isTodayDate, isYesterdayDate, formatDate, getPercentageOfNumber, getPayloadDates, getPrevDate, formatTextToEqualBlockWidth, };
//# sourceMappingURL=utils.d.ts.map