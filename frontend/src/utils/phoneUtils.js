/**
 * Normalizes any phone input into a strict 10-digit Indian mobile number.
 * Strips '+91', leading '91' (when input exceeds 10 digits), leading '0', spaces, and all non-digits.
 * Example:
 *   "+91 9962775630" -> "9962775630"
 *   "919962775630"   -> "9962775630"
 *   "09962775630"    -> "9962775630"
 *   "9962775630"     -> "9962775630"
 */
export function clean10DigitMobile(raw) {
  if (!raw) return '';
  let str = String(raw).trim();
  if (str.startsWith('+91')) {
    str = str.slice(3);
  } else if (str.startsWith('+')) {
    str = str.slice(1);
  }
  let digits = str.replace(/\D/g, '');
  if (digits.length >= 11 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  } else if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits.slice(0, 10);
}

export function formatWith91(raw) {
  const clean = clean10DigitMobile(raw);
  return clean ? `+91 ${clean}` : '+91 ----------';
}
