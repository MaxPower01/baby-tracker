import { isNullOrWhiteSpace, isValidActivityType } from "@/utils/utils";
import { useParams, useSearchParams } from "react-router-dom";

import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryForm from "@/pages/Entries/components/EntryForm";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { MenuProvider } from "@/components/Menu/MenuProvider";
import { RootState } from "@/store/store";
import { entryTypeIsValid } from "@/pages/Entry/utils/entryTypeIsValid";
import { getDefaultEntryForType } from "@/pages/Entry/utils/getDefaultEntryForType";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function EntryPage() {
  const { entryId } = useParams();
  const isNewEntry = isNullOrWhiteSpace(entryId);
  const [searchParams] = useSearchParams();
  const entryType = searchParams.get("type");
  const invalidEntryType = useMemo(
    () => !entryTypeIsValid(entryType),
    [entryType]
  );
  if (isNewEntry && invalidEntryType) {
    // TODO: Show error message
    console.error("Invalid entry type");
    return null;
  }
  const entry: Entry | null = isNewEntry
    ? getDefaultEntryForType(entryType)
    : useSelector((state: RootState) =>
        state.entriesReducer.entries.find((entry) => entry.id === entryId)
      ) ?? null;
  if (!entry) {
    // TODO: Try to load entry from server
    console.error("Entry not found");
    return null;
  }
  return (
    <MenuProvider>
      <EntryForm entry={entry} />
    </MenuProvider>
  );
}
