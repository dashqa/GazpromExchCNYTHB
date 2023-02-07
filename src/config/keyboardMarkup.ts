import { InlineKeyboard, Keyboard } from 'grammy';
import { KeyboardLocales } from './locales';

const KeyboardMarkup = {
  start: new Keyboard()
    .text(KeyboardLocales.PAYMENT)
    .text(KeyboardLocales.WITHDRAW).row()
    .text(KeyboardLocales.SETTINGS)
    .oneTime()
    .resized(),
  back: new InlineKeyboard()
    .text(KeyboardLocales.BACK, 'keyboard_back'),
  isBefore4pm: new InlineKeyboard()
    .text(KeyboardLocales.BEFORE_4PM, 'before_4pm')
    .text(KeyboardLocales.AFTER_4PM, 'after_4pm').row()
    .text(KeyboardLocales.BACK, 'keyboard_back'),
  moreInfo: new InlineKeyboard()
    .text(KeyboardLocales.MORE_INFO, 'more_info'),
  includeATMCommission: new InlineKeyboard()
    .text(KeyboardLocales.INCLUDE_ATM_COMMISSION, 'include_ATM_commission')
    .text(KeyboardLocales.NOT_INCLUDE_ATM_COMMISSION, 'not_include_ATM_comission').row()
    .text(KeyboardLocales.BACK, 'keyboard_back'),
  withdrawalType: new InlineKeyboard()
    .text(KeyboardLocales.WITHDRAWAL_TYPE_FROM_RUB.toUpperCase(), 'withdrawal_type_from_rub').row()
    .text(KeyboardLocales.WITHDRAWAL_TYPE_FROM_THB.toUpperCase(), 'withdrawal_type_from_thb'),
  help: new InlineKeyboard()
    .text(KeyboardLocales.HELP_PAYMENT.toUpperCase(), 'help_payment').row()
    .text(KeyboardLocales.HELP_WITHDRAWAL.toUpperCase(), 'help_withdrawal')
    .row()
    .text(KeyboardLocales.HELP_SETTINGS.toUpperCase(), 'help_settings'),
};

export { KeyboardMarkup };
