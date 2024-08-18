import { useParams, useSearchParams } from "react-router-dom";

import { Entry } from "@/pages/Entry/types/Entry";
import EntryForm from "@/pages/Entry/components/EntryForm";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MenuProvider } from "@/components/MenuProvider";
import { getDefaultEntry } from "@/utils/getDefaultEntry";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEntries } from "@/components/EntriesProvider";
import { useState } from "react";

export function EntryPage() {
  const [searchParams] = useSearchParams();
  const { dateKey, entryId } = useParams();
  const { user } = useAuthentication();
  const { getEntry, isFetching } = useEntries();

  const babyId = user?.babyId ?? "";
  const entryType = searchParams.get("type");

  const isNewEntry =
    isNullOrWhiteSpace(entryId) &&
    isNullOrWhiteSpace(dateKey) &&
    !isNullOrWhiteSpace(entryType) &&
    !isNullOrWhiteSpace(babyId);

  const [entry, setEntry] = useState<Entry | null | undefined>(
    isNewEntry ? getDefaultEntry(entryType as string, babyId) : undefined
  );

  if (
    !isNewEntry &&
    !isNullOrWhiteSpace(entryId) &&
    !isNullOrWhiteSpace(dateKey) &&
    !isNullOrWhiteSpace(babyId)
  ) {
    getEntry({
      id: entryId as string,
      babyId: user?.babyId as string,
      dateKey: dateKey as string,
    }).then((entry) => {
      setEntry(entry);
    });
  }

  if (entry == null) {
    if (!isNewEntry && isFetching) {
      return <LoadingIndicator />;
    } else {
      // TODO: Show error message
      return <></>;
    }
  } else {
    return (
      <MenuProvider>
        <EntryForm entry={entry} />
      </MenuProvider>
    );
  }
}
