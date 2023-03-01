import { ContextType, ConversationType } from '../../types';
import { saveOrUpdateUser } from '../../db';
import { useSettingsCommand } from '../../commands/settings';

const SettingsDeleteRate = async (conversation: ConversationType, ctx: ContextType) => {
  await saveOrUpdateUser({
    id: ctx.from.id,
    settings: {
      boughtRate: {
        rate: 0,
        date: '',
      },
    },
  });

  await useSettingsCommand(ctx);
};

export { SettingsDeleteRate };
