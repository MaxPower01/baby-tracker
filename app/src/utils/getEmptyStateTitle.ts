import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStatePeriod } from "@/enums/EmptyStatePeriod";
import { EntryType } from "@/pages/Entries/enums/EntryType";

export function getEmptyStateTitle(props: {
  type?: EntryType | undefined;
  period?: EmptyStatePeriod | undefined;
  context: EmptyStateContext;
  onClick?: (() => void) | undefined;
}) {
  let result = "";
  return result;
}
