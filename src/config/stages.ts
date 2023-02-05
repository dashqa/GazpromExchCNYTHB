import { ConversationLocales } from './locales';
import { escapeChars } from '../utils';
import { KeyboardMarkup } from './keyboardMarkup';

const PaymentStages = [
  {
    stage: 1,
    message: escapeChars(ConversationLocales.PAYMENT_STAGE[1]),
    reply_markup: null,
  },
  {
    stage: 2,
    message: escapeChars(ConversationLocales.PAYMENT_STAGE[2]),
    reply_markup: KeyboardMarkup.back,
  },
  {
    stage: 3,
    message: escapeChars(ConversationLocales.PAYMENT_STAGE[3]),
    reply_markup: KeyboardMarkup.back,
  },
  {
    stage: 4,
    message: escapeChars(ConversationLocales.PAYMENT_STAGE[4]),
    reply_markup: KeyboardMarkup.isBefore4pm,
  },
];

const WithdrawalStages = {
  FROM_RUB: [
    {
      stage: 1,
      message: escapeChars(ConversationLocales.WITHDRAWAL_STAGE.FROM_RUB[1]),
      reply_markup: null,
    },
    {
      stage: 2,
      message: escapeChars(ConversationLocales.WITHDRAWAL_STAGE.FROM_RUB[2]),
      reply_markup: KeyboardMarkup.back,
    },
    {
      stage: 3,
      message: escapeChars(ConversationLocales.WITHDRAWAL_STAGE.FROM_RUB[3]),
      reply_markup: KeyboardMarkup.includeATMCommission,
    },
  ],
  FROM_THB: [
    {
      stage: 1,
      message: escapeChars(ConversationLocales.WITHDRAWAL_STAGE.FROM_THB[1]),
      reply_markup: null,
    },
    {
      stage: 2,
      message: escapeChars(ConversationLocales.WITHDRAWAL_STAGE.FROM_THB[2]),
      reply_markup: KeyboardMarkup.back,
    },
    {
      stage: 3,
      message: escapeChars(ConversationLocales.WITHDRAWAL_STAGE.FROM_THB[3]),
      reply_markup: KeyboardMarkup.includeATMCommission,
    },
  ],
};

export { PaymentStages, WithdrawalStages };
