import { ATM_COMISSION } from './contstants';

const KeyboardLocales = {
  PAYMENT: '💳 Покупка',
  WITHDRAW: '💰 Снятие',
  SETTINGS: '⚙️ Настройки',
  BACK: 'Назад ↩️',
  BEFORE_4PM: '✅',
  AFTER_4PM: '❌',
  MORE_INFO: '⚡️ Больше информации',
  INCLUDE_ATM_COMMISSION: '✅',
  NOT_INCLUDE_ATM_COMMISSION: '❌',
  WITHDRAWAL_TYPE_FROM_RUB: 'У меня RUB на бирже,\n сколько могу снять THB',
  WITHDRAWAL_TYPE_FROM_THB: 'Хочу снять THB,\n узнать курс обмена',
  HELP_PAYMENT: '💳 Покупка',
  HELP_WITHDRAWAL: '💰 Снятие',
  HELP_SETTINGS: '⚙️ Настройки',
};

const ConversationLocales = {
  CHOOSE_WITHDRAWAL_TYPE: '*Выберете, какую информацию показать*👇 ✅',
  PAYMENT_STAGE: {
    1: '*Введите сумму покупки в THB* 🇹🇭',
    2: '*Введите курс покупки RUB 🇷🇺 -> CNY* 🇨🇳',
    3: '*Введите списанную с карты сумму в CNY* 🇨🇳',
    4: '*Время операции: до 15:30 (GMT +7)*',
    5: '*Итого*:',
  },
  WITHDRAWAL_STAGE: {
    FROM_RUB: {
      1: '*Введите сумму покупки на бирже в RUB *🇷🇺',
      2: '*Введите курс покупки RUB 🇷🇺 -> CNY* 🇨🇳',
      3: `*Учитывать комиссию банкомата ${ATM_COMISSION} THB 🇹🇭*`,
    },
    FROM_THB: {
      1: '*Введите сумму снятия в THB* 🇹🇭',
      2: '*Введите курс покупки RUB 🇷🇺 -> CNY* 🇨🇳',
      3: `*Учитывать комиссию банкомата ${ATM_COMISSION} THB 🇹🇭*`,
    },
  },
};

const ErrorLocales = {
  MSG: '🥺 _Что-то пошло не так, пропишите /start для возврата в главное меню_',
  NOT_NUMBER: '🙀 _Некорректное число❗️_',
};

export {
  KeyboardLocales,
  ConversationLocales,
  ErrorLocales,
};
