import { PoopColorId } from "@/enums/PoopColorId";

export function getPoopColor(poopColorId: PoopColorId | null | undefined) {
  let result = {
    id: "",
    name: "",
    value: "",
  };
  if (poopColorId === null || poopColorId === undefined) {
    return result;
  }
  switch (poopColorId) {
    case PoopColorId.Yellow:
      result = {
        id: "yellow",
        name: "Jaune",
        value: "#DAB600",
      };
      break;
    case PoopColorId.Brown:
      result = {
        id: "brown",
        name: "Brun",
        value: "#A55E55",
      };
      break;
    case PoopColorId.DarkBrown:
      result = {
        id: "dark-brown",
        name: "Brun foncé",
        value: "#69322B",
      };
      break;
    case PoopColorId.Green:
      result = {
        id: "green",
        name: "Vert",
        value: "#838E0B",
      };
      break;
    case PoopColorId.Orange:
      result = {
        id: "orange",
        name: "Orange",
        value: "#F59B00",
      };
      break;
    case PoopColorId.Red:
      result = {
        id: "red",
        name: "Rouge",
        value: "#F53100",
      };
      break;
    case PoopColorId.White:
      result = {
        id: "white",
        name: "Blanc",
        value: "#D9D9D9",
      };
      break;
    case PoopColorId.LightBrown:
      result = {
        id: "light-brown",
        name: "Brun clair",
        value: "#96746E",
      };
      break;
    default:
      break;
  }
  return result;
}
