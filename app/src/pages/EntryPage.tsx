import ActivityType from "@/modules/activities/enums/ActivityType";
import { ActivityModel } from "@/modules/activities/models/ActivityModel";
import EntryForm from "@/modules/entries/components/EntryForm";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import { selectEntry } from "@/modules/entries/state/entriesSlice";
import { RootState } from "@/modules/store/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { isValidActivityType } from "../lib/utils";

export default function EntryPage() {
  const { entryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activityParam = searchParams.get("activity");
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

  return <EntryForm entry={entry} isEditing={existingEntry != null} />;
}
