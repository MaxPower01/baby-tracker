import ChildrenContext from "@/modules/children/components/ChildrenContext";
import { useContext } from "react";

export default function useChidlren() {
  const entries = useContext(ChildrenContext);
  if (entries == null) {
    throw new Error(
      "Children context is null. Make sure to call useChidlren() inside of a <ChildrenProvider />"
    );
  }
  return entries;
}
