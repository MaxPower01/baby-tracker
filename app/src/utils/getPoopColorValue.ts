import { PoopColorId } from "@/enums/PoopColorId";

export function getPoopColorValue(poopColorId: PoopColorId | null | undefined) {
  let result = {
    label: "",
    value: "",
  };
  if (poopColorId === null || poopColorId === undefined) {
    return result;
  }
  switch (poopColorId) {
    case PoopColorId.Yellow:
      result = {
        label: "Jaune",
        value: "#E1AD01",
      };
      break;
    case PoopColorId.Brown:
      result = {
        label: "Brun",
        value: "#8B4513",
      };
      break;
    case PoopColorId.DarkBrown:
      result = {
        label: "Brun foncé",
        value: "#2C1900",
      };
      break;
    case PoopColorId.Green:
      result = {
        label: "Vert",
        value: "#6B8E23",
      };
      break;
    case PoopColorId.Orange:
      result = {
        label: "Orange",
        value: "#FFA500",
      };
      break;
    case PoopColorId.Red:
      result = {
        label: "Rouge",
        value: "#FF0000",
      };
      break;
    case PoopColorId.White:
      result = {
        label: "Blanc",
        value: "#D3D3D3",
      };
      break;
    default:
      break;
  }
  return result;
}
