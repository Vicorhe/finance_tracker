export function onlyLowerCaseAlphaNumeric(s) {
  return /^[a-z0-9]{2,17}$/.test(s)
}