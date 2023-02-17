import { ContextType } from '../../types';
import { escapeChars } from '../../utils';

const useHelpPaymentCallback = async (ctx: ContextType) => {
  ctx.replyWithMarkdown(
    escapeChars(`
      \n *Цель*: 
      \nПомогает определить конечную сумму покупки в *CNY* 🇨🇳 и кросс-курс *RUB -> THB*. 
      \nУчитывает курс, по которому куплены *CNY* 🇨🇳 на бирже, и курс покупки *THB -> CNY* платёжной системы *UnionPay*.
      \nКурс обмена *UnionPay* обновляется ежедневно в 15:30 (GMT +7). До 15:30 курс *UnionPay* будет равен курсу предыдущего рабочего дня.
      \n *Сценарий использования*: 
      \nОплатили покупку в магазине на сумму *1000 THB* 🇹🇭. С карты списали (заморозили) *250 CNY* 🇨🇳. Юани куплены на бирже по курсу *10.2* *(CNY -> RUB)*. 
      \nТеперь хотим узнать, конечную сумму покупки CNY 🇨🇳, сколько CNY 🇨🇳 вернут на карту после разморозки, какой получился кросс-курс *RUB -> THB*.
  `),
  );
};

export { useHelpPaymentCallback };
