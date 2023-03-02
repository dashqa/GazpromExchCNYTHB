/// <reference types="mongoose" />
import { UnionPayExchangeRateType } from '../types';
type IRate = {
    date: string;
    rate: number;
};
type ISettings = {
    boughtRate: IRate;
};
type IUnionPayRate = {
    target: UnionPayExchangeRateType;
    prev: UnionPayExchangeRateType;
    lastModified: number;
    hasActualRate: boolean;
};
interface IUser {
    id: number;
    settings?: ISettings;
    chat_id?: number;
    username?: string;
    unionPayRate?: IUnionPayRate;
}
declare const User: import("mongoose").Model<IUser, {}, {}>;
export { User, IUser, IRate, ISettings, IUnionPayRate, };
//# sourceMappingURL=UserSchema.d.ts.map