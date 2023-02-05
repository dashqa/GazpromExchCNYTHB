import { ContextType } from '../types';

const useHelpCommand = async (ctx: ContextType) => {
  ctx.replyWithMarkdown('d');
};

export { useHelpCommand };
