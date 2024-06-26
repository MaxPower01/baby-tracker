import { isNullOrWhiteSpace, isValidActivityType } from "@/utils/utils";
import { useParams, useSearchParams } from "react-router-dom";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryForm from "@/pages/Entry/components/EntryForm";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { MenuProvider } from "@/components/MenuProvider";
import { RootState } from "@/state/store";
import { entryTypeIsValid } from "@/pages/Entry/utils/entryTypeIsValid";
import { getDefaultEntry } from "@/utils/getDefaultEntry";
import { selectRecentEntry } from "@/state/slices/entriesSlice";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function EntryPage() {
  const { entryId } = useParams();
  const { user } = useAuthentication();
  const isNewEntry = isNullOrWhiteSpace(entryId);
  const [searchParams] = useSearchParams();
  const entryType = searchParams.get("type");
  const invalidEntryType = useMemo(
    () => !entryTypeIsValid(entryType),
    [entryType]
  );
  if (user == null || isNullOrWhiteSpace(user?.babyId)) {
    console.error("No selected baby while trying to create an entry");
    return null;
  }
  if (isNewEntry && invalidEntryType) {
    // TODO: Show error message
    console.error("Invalid entry type");
    return null;
  }

  const entry: Entry | null | undefined =
    isNewEntry || isNullOrWhiteSpace(entryId)
      ? getDefaultEntry(entryType, user.babyId)
      : useSelector((state: RootState) =>
          selectRecentEntry(state, entryId as string)
        );
  if (!entry) {
    // TODO: Try to load entry from server
    // TODO: Show error message
    console.error("Entry not found");
    return null;
  }
  return (
    <MenuProvider>
      <EntryForm entry={entry} />
    </MenuProvider>
  );
}
