export const formatNumber = (num = 0) => {
  const absNum = Math.abs(num);
  let formatted = '';

  if (absNum >= 1_000_000_000) {
    formatted = (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absNum >= 1_000_000) {
    formatted = (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absNum >= 1_000) {
    formatted = (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    formatted = num.toString();
  }

  return formatted;
}