import { ContextType } from '../../types';
import { escapeChars } from '../../utils';

const useHelpPaymentCallback = async (ctx: ContextType) => {
  ctx.replyWithMarkdown(
    escapeChars(`
      \n *Цель*: 
      \nПомогает определить конечную сумму покупки в *CNY* 🇨🇳 и кросс-курс *RUB -> THB*. 
      \nУчитывает курс, по которому куплены *CNY* 🇨🇳 на бирже, процент за покупку *CNY* 🇨🇳 на бирже *(0.05%)*, процент вывода с биржи *(0.15%)* и курс покупки *THB -> CNY* платёжной системы *UnionPay*.
      \n *Сценарий использования*: 
      \nОплатили покупку в магазине на сумму *1000 THB* 🇹🇭. С карты списали (заморозили) *250 CNY* 🇨🇳. Юани куплены на бирже по курсу *10.2* *(RUB -> CNY)*.
      \nТеперь хотим узнать, конечную сумму покупки CNY 🇨🇳, сколько CNY 🇨🇳 вернут на карту после разморозки, какой получился кросс-курс *RUB -> THB*.
  `),
  );
};

export { useHelpPaymentCallback };
