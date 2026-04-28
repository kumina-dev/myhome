import {
  combineDateAndTime,
  isValidPin,
  normalizeCurrencyCode,
  normalizeEmail,
  normalizeInviteCode,
  normalizeOptionalText,
  normalizePinInput,
  normalizeRequiredText,
  parseHour,
  parseMinute,
  parseMoneyToCents,
  parsePositiveInteger,
} from '../src/shared/validation/forms';

describe('form validation helpers', () => {
  it('normalizes required and optional text', () => {
    expect(normalizeRequiredText('  hello   world  ')).toBe('hello world');
    expect(normalizeRequiredText('   ')).toBeNull();
    expect(normalizeOptionalText('  note  ')).toBe('note');
    expect(normalizeOptionalText('   ')).toBeUndefined();
  });

  it('normalizes valid email and rejects invalid email', () => {
    expect(normalizeEmail(' OWNER@NorthCircle.App ')).toBe(
      'owner@northcircle.app',
    );
    expect(normalizeEmail('not-an-email')).toBeNull();
    expect(normalizeEmail('missing@example')).toBeNull();
  });

  it('normalizes invite codes without accepting empty junk', () => {
    expect(normalizeInviteCode(' north-7832 ')).toBe('NORTH-7832');
    expect(normalizeInviteCode(' ab c1 ')).toBe('ABC1');
    expect(normalizeInviteCode('***')).toBeNull();
  });

  it('normalizes currency code only when it is exactly three letters', () => {
    expect(normalizeCurrencyCode(' eur ')).toBe('EUR');
    expect(normalizeCurrencyCode('EU')).toBeNull();
    expect(normalizeCurrencyCode('EURO')).toBeNull();
    expect(normalizeCurrencyCode('12€')).toBeNull();
  });

  it('normalizes and validates PIN values', () => {
    expect(normalizePinInput(' 25a80-999 ')).toBe('258099');
    expect(isValidPin('2580')).toBe(true);
    expect(isValidPin('258099')).toBe(true);
    expect(isValidPin('258')).toBe(false);
    expect(isValidPin('2580999')).toBe(false);
    expect(isValidPin('25a0')).toBe(false);
  });

  it('parses positive money values into cents', () => {
    expect(parseMoneyToCents('84.20')).toBe(8420);
    expect(parseMoneyToCents('84,2')).toBe(8420);
    expect(parseMoneyToCents('1')).toBe(100);
    expect(parseMoneyToCents('0')).toBeNull();
    expect(parseMoneyToCents('-1')).toBeNull();
    expect(parseMoneyToCents('12.345')).toBeNull();
    expect(parseMoneyToCents('abc')).toBeNull();
  });

  it('parses positive integers only', () => {
    expect(parsePositiveInteger('3')).toBe(3);
    expect(parsePositiveInteger('003')).toBe(3);
    expect(parsePositiveInteger('0')).toBeNull();
    expect(parsePositiveInteger('-1')).toBeNull();
    expect(parsePositiveInteger('1.5')).toBeNull();
  });

  it('parses hours and minutes including zero-padded zero', () => {
    expect(parseHour('00')).toBe(0);
    expect(parseHour('0')).toBe(0);
    expect(parseHour('23')).toBe(23);
    expect(parseHour('24')).toBeNull();
    expect(parseMinute('00')).toBe(0);
    expect(parseMinute('59')).toBe(59);
    expect(parseMinute('60')).toBeNull();
  });

  it('combines ISO date and validated time into an ISO timestamp', () => {
    const combined = combineDateAndTime('2026-04-28', 9, 30);

    expect(combined).not.toBeNull();
    expect(new Date(combined as string).getHours()).toBe(9);
    expect(new Date(combined as string).getMinutes()).toBe(30);
    expect(combineDateAndTime('2026/04/28', 9, 30)).toBeNull();
    expect(combineDateAndTime('2026-02-31', 9, 30)).toBeNull();
    expect(combineDateAndTime('2026-13-01', 9, 30)).toBeNull();
    expect(combineDateAndTime('2026-04-28', 24, 0)).toBeNull();
    expect(combineDateAndTime('2026-04-28', 9, 60)).toBeNull();
  });
});
