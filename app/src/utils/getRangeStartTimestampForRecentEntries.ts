import { RECENT_DATA_AGE_LIMIT } from "@/constants/RECENT_DATA_AGE_LIMIT";
import { Timestamp } from "firebase/firestore";

export function getRangeStartTimestampForRecentEntries() {
  const rangeEndDate = new Date();
  const rangeStartDate = new Date(
    rangeEndDate.getTime() - RECENT_DATA_AGE_LIMIT
  );
  const rangeStartTimestamp = Timestamp.fromDate(rangeStartDate);
  return rangeStartTimestamp;
}
