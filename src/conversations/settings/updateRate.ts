import { ContextType, ConversationType } from '../../types';
import { ErrorLocales } from '../../config';
import {
  escapeChars, isNumeric, replaceComma, formatDate,
} from '../../utils';
import { saveOrUpdateUser } from '../../db';
import { useSettingsCommand } from '../../commands';

const SettingsUpdateRate = async (conversation: ConversationType, ctx: ContextType) => {
  await ctx.replyWithMarkdown(
    escapeChars(
      `Введите курс из истории операций брокера 👇
      \n❗️*НЕ НАДО*❗️ добавлять комиссии банка/брокера к курсу.`,
    ),
  );

  const context = await conversation.wait();

  const message = replaceComma(context?.update?.message?.text) as unknown as number;

  if (message && !isNumeric(message as unknown as string) && !context?.update?.callback_query?.data) {
    context.deleteMessage();
    await ctx.replyWithMarkdown(escapeChars(ErrorLocales.NOT_NUMBER));
  } else {
    await saveOrUpdateUser({
      id: ctx.from.id,
      settings: {
        boughtRate: {
          rate: message,
          date: formatDate(new Date(), 'd MMMM HH:mm'),
        },
      },
    });

    await useSettingsCommand(ctx);
  }
};

export { SettingsUpdateRate };
