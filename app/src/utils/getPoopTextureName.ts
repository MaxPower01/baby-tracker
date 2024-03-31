import { PoopTextureId } from "@/enums/PoopTextureId";

export function getPoopTextureName(
  poopTexture: PoopTextureId | null | undefined
) {
  if (poopTexture === null || poopTexture === undefined) {
    return "";
  }
  switch (poopTexture) {
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
      return "Très épais (constipation)";
    default:
      return "";
  }
}
