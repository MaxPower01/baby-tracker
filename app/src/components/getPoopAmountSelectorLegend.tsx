export function getPoopAmountSelectorLegend(value: number) {
  if (value === 0) {
    return "Aucun caca";
  } else if (value === 1) {
    return "Un peu de caca";
  } else if (value === 2) {
    return "Moyennement de caca";
  } else if (value === 3) {
    return "Beaucoup de caca";
  } else if (value === 4) {
    return "Énormément de caca";
  } else if (value === 5) {
    return "Une tonne de caca";
  }
  return "Quantité de caca";
}
