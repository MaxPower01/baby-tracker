import { PoopConsistencyId } from "@/enums/PoopConsistencyId";

export function getPoopConsistencyTypeName(
  poopConsistency: PoopConsistencyId | null | undefined
) {
  if (poopConsistency === null || poopConsistency === undefined) {
    return "";
  }
  switch (poopConsistency) {
    case PoopConsistencyId.Normal:
      return "Normal";
    case PoopConsistencyId.Meconium:
      return "Méconium";
    case PoopConsistencyId.Soft:
      return "Mou";
    case PoopConsistencyId.Liquid:
      return "Liquide";
    case PoopConsistencyId.Thick:
      return "Épais";
    case PoopConsistencyId.Lumpy:
      return "Grumeleux";
    case PoopConsistencyId.UndigestedPieces:
      return "Morceaux non digérés";
    case PoopConsistencyId.VeryLiquid:
      return "Très liquide (diarrhée)";
    case PoopConsistencyId.VeryThick:
      return "Très épaisse (constipation)";
    default:
      return "";
  }
}
