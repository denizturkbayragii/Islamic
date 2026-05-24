export interface ZakatInput {
  cash: number;
  goldGrams: number;
  silverGrams: number;
  investments: number;
  businessAssets: number;
  debts: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
  nisabBasis: 'gold' | 'silver';
}

export interface ZakatResult {
  totalWealth: number;
  nisabThreshold: number;
  zakatableAmount: number;
  zakatDue: number;
  isObligatory: boolean;
}

const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025;

export function calculateZakat(input: ZakatInput): ZakatResult {
  const goldValue = input.goldGrams * input.goldPricePerGram;
  const silverValue = input.silverGrams * input.silverPricePerGram;
  const totalWealth =
    input.cash +
    goldValue +
    silverValue +
    input.investments +
    input.businessAssets -
    input.debts;

  const nisabThreshold =
    input.nisabBasis === 'gold'
      ? NISAB_GOLD_GRAMS * input.goldPricePerGram
      : NISAB_SILVER_GRAMS * input.silverPricePerGram;

  const isObligatory = totalWealth >= nisabThreshold;
  const zakatableAmount = isObligatory ? totalWealth : 0;
  const zakatDue = zakatableAmount * ZAKAT_RATE;

  return {
    totalWealth,
    nisabThreshold,
    zakatableAmount,
    zakatDue,
    isObligatory,
  };
}

export function calculateSadaqaSuggested(monthlyIncome: number, percentage: number): number {
  return (monthlyIncome * percentage) / 100;
}
