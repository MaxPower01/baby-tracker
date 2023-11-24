import { useParams, useSearchParams } from "react-router-dom";

import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import EntryForm from "@/pages/Entries/components/EntryForm";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { MenuProvider } from "@/components/Menu/MenuProvider";
import { RootState } from "@/store/store";
import { isValidActivityType } from "@/utils/utils";
import { useAppSelector } from "@/store/hooks/useAppSelector";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function EntryPage() {
  const { entryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activityParam = searchParams.get("activity");
  const shouldStartTimerParam = searchParams.get("shouldStartTimer");
  const existingEntry = useAppSelector((state) =>
    state.entriesReducer.entries.find((entry) => entry.id === entryId)
  );

  const activityType = useMemo(() => {
    if (isValidActivityType(activityParam)) {
      return Number(activityParam) as ActivityType;
    }
    return null;
  }, [activityParam]);

  const entry = useMemo(() => {
    if (existingEntry) {
      return existingEntry;
    }
    const newEntry = new EntryModel();
    if (activityType) {
      newEntry.activity = new ActivityModel(activityType);
    }
    return newEntry;
  }, [activityType, existingEntry]);

  // if (!entry) {
  //   return <LoadingIndicator />;
  // }

  return (
    <MenuProvider>
      <EntryForm
        entry={entry}
        shouldStartTimer={shouldStartTimerParam as any}
      />
    </MenuProvider>
  );
}
