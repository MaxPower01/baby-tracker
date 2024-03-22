import { PoopTextureId } from "@/enums/PoopTextureId";

export function getPoopConsistencyTypeName(
  poopConsistency: PoopTextureId | null | undefined
) {
  if (poopConsistency === null || poopConsistency === undefined) {
    return "";
  }
  switch (poopConsistency) {
    case PoopTextureId.Normal:
      return "Normal";
    case PoopTextureId.Meconium:
      return "Méconium";
    case PoopTextureId.Soft:
      return "Mou";
    case PoopTextureId.Liquid:
      return "Liquide";
    case PoopTextureId.Thick:
      return "Épais";
    case PoopTextureId.Lumpy:
      return "Grumeleux";
    case PoopTextureId.UndigestedPieces:
      return "Morceaux non digérés";
    case PoopTextureId.VeryLiquid:
      return "Très liquide (diarrhée)";
    case PoopTextureId.VeryThick:
      return "Très épaisse (constipation)";
    default:
      return "";
  }
}
