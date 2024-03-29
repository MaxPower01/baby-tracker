export function formatWeight(weight: number) {
  let result = weight.toFixed(2);
  while (result.includes(".") && result.endsWith("0")) {
    result = result.slice(0, -1);
  }
  if (result.endsWith(".")) {
    result = result.slice(0, -1);
  }
  return result;
}
