import { NasalHygieneType } from "@/enums/NasalHygieneType";

export function getNasalHygieneTypeName(
  nasalHygieneType: NasalHygieneType | null | undefined
) {
  if (nasalHygieneType === null || nasalHygieneType === undefined) {
    return "";
  }
  switch (nasalHygieneType) {
    case NasalHygieneType.Aspirator:
      return "Aspirateur nasal";
    case NasalHygieneType.Saline:
      return "Solution saline";
    default:
      return "";
  }
}
