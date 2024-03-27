import { RECENT_DATA_AGE_LIMIT_IN_MILLISECONDS } from "@/constants/RECENT_DATA_AGE_LIMIT";
import { Timestamp } from "firebase/firestore";
import { getTimestamp } from "@/utils/getTimestamp";

export function getRangeStartTimestampForRecentEntries() {
  const rangeEndDate = new Date();
  const rangeStartDate = new Date(
    rangeEndDate.getTime() - RECENT_DATA_AGE_LIMIT_IN_MILLISECONDS
  );
  const rangeStartTimestamp = getTimestamp(rangeStartDate);
  return rangeStartTimestamp;
}
