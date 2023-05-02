import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import LoadingIndicator from "../common/components/LoadingIndicator";
import { ActivityType } from "../lib/enums";
import { isValidActivityType } from "../lib/utils";
import { ActivityModel } from "../modules/activities/models/ActivityModel";
import EntryForm from "../modules/entries/components/EntryForm";
import { EntryModel } from "../modules/entries/models/EntryModel";
import { selectEntry } from "../modules/entries/state/entriesSlice";
import { RootState } from "../modules/store/store";

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
    if (activityType) {
      return new EntryModel({ activity: new ActivityModel(activityType) });
    }
    return null;
  }, [activityType, existingEntry]);

  if (!entry) {
    return <LoadingIndicator />;
  }

  return <EntryForm entry={entry} isEditing={existingEntry != null} />;
}
