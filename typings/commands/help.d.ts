import { ContextType } from '../types';
import { useHelpPaymentCallback } from './help/helpPayment';
import { useHelpWithdrawalCallback } from './help/helpWithdrawal';
import { useHelpSettingsCallback } from './help/helpSettings';
declare const useHelpCommand: (ctx: ContextType) => Promise<void>;
export { useHelpCommand, useHelpPaymentCallback, useHelpWithdrawalCallback, useHelpSettingsCallback, };
//# sourceMappingURL=help.d.ts.map