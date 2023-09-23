import { useParams, useSearchParams } from "react-router-dom";

import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import EntryForm from "@/modules/entries/components/EntryForm";
import EntryModel from "@/modules/entries/models/EntryModel";
import MenuProvider from "@/components/Menu/MenuProvider";
import { RootState } from "@/modules/store/store";
import { isValidActivityType } from "@/utils/utils";
import { selectEntry } from "@/modules/entries/state/entriesSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function EntryPage() {
  const { entryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activityParam = searchParams.get("activity");
  const shouldStartTimerParam = searchParams.get("shouldStartTimer");
  const existingEntry = useSelector((state: RootState) =>
    selectEntry(state, entryId ?? "")
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
