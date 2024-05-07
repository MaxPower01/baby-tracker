export function getUrineAmountSelectorLegend(value: number) {
  if (value === 0) {
    return "Aucun pipi";
  } else if (value === 1) {
    return "Un peu de pipi";
  } else if (value === 2) {
    return "Moyennement de pipi";
  } else if (value === 3) {
    return "Beaucoup de pipi";
  } else if (value === 4) {
    return "Énormément de pipi";
  } else if (value === 5) {
    return "Une tonne de pipi";
  }
  return "Quantité de pipi";
}
