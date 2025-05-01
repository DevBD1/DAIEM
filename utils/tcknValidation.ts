export const validateTCKN = (tckn: string): boolean => {
  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(tckn)) {
    return false;
  }

  const digits = tckn.split("").map(Number);

  // First digit cannot be 0
  if (digits[0] === 0) {
    return false;
  }

  // Check 10th digit algorithm
  const digit10 =
    ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 -
      (digits[1] + digits[3] + digits[5] + digits[7])) %
    10;
  if (digit10 !== digits[9]) {
    return false;
  }

  // Check 11th digit algorithm
  const digit11 =
    digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
  if (digit11 !== digits[10]) {
    return false;
  }

  return true;
};
