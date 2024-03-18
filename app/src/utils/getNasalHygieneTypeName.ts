import { NasalHygieneId } from "@/enums/NasalHygieneId";

export function getNasalHygieneTypeName(
  nasalHygieneType: NasalHygieneId | null | undefined
) {
  if (nasalHygieneType === null || nasalHygieneType === undefined) {
    return "";
  }
  switch (nasalHygieneType) {
    case NasalHygieneId.Aspirator:
      return "Aspirateur nasal";
    case NasalHygieneId.Saline:
      return "Solution saline";
    default:
      return "";
  }
}
