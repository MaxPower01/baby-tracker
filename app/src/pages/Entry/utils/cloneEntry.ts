import { Entry } from "@/pages/Entry/types/Entry";
import { deserializeEntry } from "@/pages/Entry/utils/deserializeEntry";
import { serializeEntry } from "@/pages/Entry/utils/serializeEntry";

export function cloneEntry(entry: Entry): Entry | null {
  return deserializeEntry(serializeEntry(entry));
}
