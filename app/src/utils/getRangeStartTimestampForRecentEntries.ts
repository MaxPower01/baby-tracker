import { Timestamp } from "firebase/firestore";
import { getTimestamp } from "@/utils/getTimestamp";
import { recentAgeDataLimitInMilliseconds } from "@/utils/constants";

export function getRangeStartTimestampForRecentEntries() {
  const rangeEndDate = new Date();
  rangeEndDate.setHours(0, 0, 0, 0);
  const rangeStartDate = new Date(
    rangeEndDate.getTime() - recentAgeDataLimitInMilliseconds
  );
  const rangeStartTimestamp = getTimestamp(rangeStartDate);
  return rangeStartTimestamp;
}
