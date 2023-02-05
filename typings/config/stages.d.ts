declare const PaymentStages: {
    stage: number;
    message: string;
    reply_markup: import("grammy").InlineKeyboard;
}[];
declare const WithdrawalStages: {
    FROM_RUB: {
        stage: number;
        message: string;
        reply_markup: import("grammy").InlineKeyboard;
    }[];
    FROM_THB: {
        stage: number;
        message: string;
        reply_markup: import("grammy").InlineKeyboard;
    }[];
};
export { PaymentStages, WithdrawalStages };
//# sourceMappingURL=stages.d.ts.map