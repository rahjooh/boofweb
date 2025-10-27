export function formatCurrency(
  amount: number,
  currency: string,
  locale = "fa-IR",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IRR" ? 0 : 2,
  }).format(amount);
}

export function formatDate(value?: string, locale = "fa-IR") {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(value));
}

const PRODUCER_NAME_MAP: Record<string, string> = {
  Boofshop: "بووف‌شاپ",
};

export function getProducerDisplayName(value: string) {
  return PRODUCER_NAME_MAP[value] ?? value;
}
