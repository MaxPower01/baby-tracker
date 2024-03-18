import { PoopColorId } from "@/enums/PoopColorId";

export function getPoopColorValue(
  poopConsistency: PoopColorId | null | undefined
) {
  let result = {
    label: "",
    value: "",
  };
  if (poopConsistency === null || poopConsistency === undefined) {
    return result;
  }
  switch (poopConsistency) {
  }
  return result;
}
