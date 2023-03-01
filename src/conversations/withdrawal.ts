import { ContextType, ConversationType } from '../types';
import {
  KeyboardMarkup, WithdrawalStages,
  ConversationLocales,
} from '../config';
import { getUser } from '../db';
import { useWithdrawalFromRub } from './withdrawalTypes/fromRub';
import { useWithdrawalFromThb } from './withdrawalTypes/fromThb';

const Withdrawal = async (conversation: ConversationType, ctx: ContextType) => {
  const stages = WithdrawalStages;
  const user = await getUser(ctx.from.id);
  const chatId = ctx.chat?.id as number;

  await ctx.replyWithMarkdown(ConversationLocales.CHOOSE_WITHDRAWAL_TYPE,
    { reply_markup: KeyboardMarkup.withdrawalType });

  const { callbackQuery } = await conversation.waitForCallbackQuery(['withdrawal_type_from_rub', 'withdrawal_type_from_thb']);

  if (callbackQuery?.data === 'withdrawal_type_from_rub') {
    await useWithdrawalFromRub(conversation, ctx, stages.FROM_RUB, chatId, user);
  }

  if (callbackQuery?.data === 'withdrawal_type_from_thb') {
    await useWithdrawalFromThb(conversation, ctx, stages.FROM_THB, chatId, user);
  }
};

export { Withdrawal };
