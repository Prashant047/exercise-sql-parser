export const isDigit = (char: string): boolean => {
  return char >= '0' && char <= '9';
}

export const isAlpha = (char: string): boolean => {
  return /[a-zA-Z_]/.test(char);
}
