import EntriesContext from "@/pages/Entries/components/EntriesContext";
import { useContext } from "react";

export default function useEntries() {
  const entries = useContext(EntriesContext);
  if (entries == null) {
    throw new Error(
      "Entries context is null. Make sure to call useEntries() inside of a <EntriesProvider />"
    );
  }
  return entries;
}
