import { ContextType } from '../../types';
import { escapeChars } from '../../utils';

const useHelpSettingsCallback = async (ctx: ContextType) => {
  ctx.replyWithMarkdown(
    escapeChars(`
      \nРаздел находится в разработке`),
  );
};

export { useHelpSettingsCallback };
