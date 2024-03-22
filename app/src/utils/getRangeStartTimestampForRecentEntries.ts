import { RECENT_DATA_AGE_LIMIT } from "@/constants/RECENT_DATA_AGE_LIMIT";
import { Timestamp } from "firebase/firestore";
import { getTimestamp } from "@/utils/getTimestamp";

export function getRangeStartTimestampForRecentEntries() {
  const rangeEndDate = new Date();
  const rangeStartDate = new Date(
    rangeEndDate.getTime() - RECENT_DATA_AGE_LIMIT
  );
  const rangeStartTimestamp = getTimestamp(rangeStartDate);
  return rangeStartTimestamp;
}
