import { PoopConsistency } from "@/enums/PoopConsistency";

export function getPoopConsistencyTypeName(
  poopConsistency: PoopConsistency | null | undefined
) {
  if (poopConsistency === null || poopConsistency === undefined) {
    return "";
  }
  switch (poopConsistency) {
    case PoopConsistency.Normal:
      return "Normal";
    case PoopConsistency.Meconium:
      return "Méconium";
    case PoopConsistency.Soft:
      return "Mou";
    case PoopConsistency.Liquid:
      return "Liquide";
    case PoopConsistency.Thick:
      return "Épais";
    case PoopConsistency.Lumpy:
      return "Grumeleux";
    case PoopConsistency.UndigestedPieces:
      return "Morceaux non digérés";
    case PoopConsistency.VeryLiquid:
      return "Très liquide (diarrhée)";
    case PoopConsistency.VeryThick:
      return "Très épaisse (constipation)";
    default:
      return "";
  }
}
