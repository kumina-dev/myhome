export function normalizeRequiredText(value: string): string | null {
  const cleaned = value.trim().replace(/\s+/g, ' ');
  return cleaned ? cleaned : null;
}

export function normalizeOptionalText(value: string): string | undefined {
  return normalizeRequiredText(value) ?? undefined;
}

export function normalizeEmail(value: string): string | null {
  const cleaned = value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

export function normalizeInviteCode(value: string): string | null {
  const cleaned = value.trim().toUpperCase().replace(/\s+/g, '');

  if (!/^[A-Z0-9-]{4,32}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

export function normalizeCurrencyCode(value: string): string | null {
  const cleaned = value.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

export function normalizePinInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function isValidPin(value: string): boolean {
  return /^\d{4,6}$/.test(value);
}

export function parseMoneyToCents(value: string): number | null {
  const cleaned = value.trim().replace(',', '.');

  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    return null;
  }

  const amount = Number(cleaned);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const cents = Math.round(amount * 100);

  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export function parsePositiveInteger(value: string): number | null {
  const cleaned = value.trim();

  if (!/^\d+$/.test(cleaned)) {
    return null;
  }

  const parsed = Number(cleaned);

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function parseHour(value: string): number | null {
  const cleaned = value.trim();

  if (!/^\d{1,2}$/.test(cleaned)) {
    return null;
  }

  const parsed = Number(cleaned);

  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 23
    ? parsed
    : null;
}

export function parseMinute(value: string): number | null {
  const cleaned = value.trim();

  if (!/^\d{1,2}$/.test(cleaned)) {
    return null;
  }

  const parsed = Number(cleaned);

  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 59
    ? parsed
    : null;
}

export function combineDateAndTime(
  dateIso: string,
  hour: number,
  minute: number,
): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
    return null;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  const date = new Date(`${dateIso}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
}
