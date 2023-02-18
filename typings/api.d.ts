import { UnionPayExchangeRateType, ForexExchangeRateTypeResponse } from './types';
declare const getUnionPayExchangeRate: (dateString: string) => Promise<UnionPayExchangeRateType[] | void>;
declare const getOtherExchangeRates: () => Promise<void | ('rejected' | Promise<ForexExchangeRateTypeResponse>[])[]>;
export { getUnionPayExchangeRate, getOtherExchangeRates };
//# sourceMappingURL=api.d.ts.map