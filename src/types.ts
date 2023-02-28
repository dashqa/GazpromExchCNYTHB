import {
  type Conversation,
  type ConversationFlavor,
} from '@grammyjs/conversations';
import type { ParseModeFlavor } from '@grammyjs/parse-mode';
import { Context, SessionFlavor } from 'grammy';

export interface UnionPayExchangeRateType {
  rate: number;
  date: string;
}

export interface ForexExchangeRateTypeRequest {
  base: string;
  symbols: string;
}

export interface ForexExchangeRateTypeResponse {
  base: string;
  date: string;
  rates: { [key: string]: number };
}

export interface ConversationStageType {
  stage: number;
  message: string;
  reply_markup: any;
}

export interface SessionType {
  unionPayRate: {
    target: UnionPayExchangeRateType;
    prev: UnionPayExchangeRateType;
  },
  hasActualRate: boolean,
}

export type ContextType = SessionFlavor<SessionType> & ConversationFlavor & ParseModeFlavor<Context>;
export type ConversationType = Conversation<ContextType>;
