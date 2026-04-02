/**
 * Format a raw phone string to (xxx) xxx-xxxx
 * Only formats if it looks like a 10-digit US number.
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // Handle 11-digit starting with 1 (country code)
  const d = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return raw;
}

/**
 * Mask phone input as user types: (xxx) xxx-xxxx
 */
export function maskPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
