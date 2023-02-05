import { ContextType } from '../types';
import { escapeChars } from '../utils';
import { ErrorLocales } from '../config/locales';

const error = async (ctx: ContextType, next: () => any) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    await ctx.replyWithMarkdown(escapeChars(ErrorLocales.MSG));
  }
};

export { error };
