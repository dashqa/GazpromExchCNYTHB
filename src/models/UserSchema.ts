import { Schema, model } from 'mongoose';
import { UnionPayExchangeRateType } from '../types';

type IRate = {
  date: string;
  rate: number;
};

type ISettings = {
  boughtRate: IRate;
};

type IUnionPayRate = {
  target:UnionPayExchangeRateType;
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

const userSchema = new Schema<IUser>({
  id: { type: Number, required: true },
  chat_id: { type: Number, required: false },
  username: { type: String, required: false },
  settings: {
    boughtRate: {
      rate: { type: Number, required: false },
      date: { type: String, required: false },
    },
  },
  unionPayRate: {
    target: {
      date: { type: String, required: false },
      rate: { type: Number, required: false },
    },
    prev: {
      date: { type: String, required: false },
      rate: { type: Number, required: false },
    },
    lastModified: { type: Number, required: false },
    hasActualRate: { type: Boolean, required: false },
  },
});

const User = model<IUser>('User', userSchema);

export {
  User, IUser, IRate, ISettings, IUnionPayRate,
};
