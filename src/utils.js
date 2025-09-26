export function cToF(celsius) {
  if (typeof celsius !== 'number' || Number.isNaN(celsius)) return null
  return Math.round((celsius * 9) / 5 + 32)
}


