import { ContextType, ConversationType } from '../types';
import {
  KeyboardMarkup, WithdrawalStages,
  ConversationLocales,
} from '../config';
import { useWithdrawalFromRub } from './withdrawalTypes/fromRub';
import { useWithdrawalFromThb } from './withdrawalTypes/fromThb';

const Withdrawal = async (conversation: ConversationType, ctx: ContextType) => {
  const stages = WithdrawalStages;
  const unionPayTargetRate = ctx.session.unionPayRate.target || ctx.session.unionPayRate.prev;
  const chatId = ctx.chat?.id as number;

  await ctx.replyWithMarkdown(ConversationLocales.CHOOSE_WITHDRAWAL_TYPE,
    { reply_markup: KeyboardMarkup.withdrawalType });

  const { callbackQuery } = await conversation.waitForCallbackQuery(['withdrawal_type_from_rub', 'withdrawal_type_from_thb']);

  if (callbackQuery?.data === 'withdrawal_type_from_rub') {
    await useWithdrawalFromRub(conversation, ctx, stages.FROM_RUB, chatId, unionPayTargetRate);
  }

  if (callbackQuery?.data === 'withdrawal_type_from_thb') {
    await useWithdrawalFromThb(conversation, ctx, stages.FROM_THB, chatId, unionPayTargetRate);
  }
};

export { Withdrawal };
