import { isValidActivityType } from "@/lib/utils";
import ActivityType from "@/modules/activities/enums/ActivityType";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import EntryForm from "@/modules/entries/components/EntryForm";
import EntryModel from "@/modules/entries/models/EntryModel";
import { selectEntry } from "@/modules/entries/state/entriesSlice";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { RootState } from "@/modules/store/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

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
        isEditing={existingEntry != null}
        shouldStartTimer={shouldStartTimerParam as any}
      />
    </MenuProvider>
  );
}
