import { Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useLayout from "../common/hooks/useLayout";
import { ActivityType } from "../lib/enums";
import { isValidActivityType } from "../lib/utils";
import ActivityIcon from "../modules/activities/components/ActivityIcon";
import { Activity } from "../modules/activities/models/Activity";

export default function Entry() {
  /* -------------------------------------------------------------------------- */
  /*                                    Setup                                   */
  /* -------------------------------------------------------------------------- */

  const layout = useLayout();

  const { entryId } = useParams();
  const isNewEntry = useMemo(() => !entryId, [entryId]);

  const [searchParams, setSearchParams] = useSearchParams();
  const activityType = searchParams.get("activity");
  const activity = useMemo(() => {
    if (isValidActivityType(activityType)) {
      return new Activity(Number(activityType) as ActivityType);
    } else {
      return null;
    }
  }, [activityType]);

  useEffect(() => {
    if (isNewEntry) {
      layout.setShouldRenderDeleteButton(false);
    } else {
      layout.setShouldRenderDeleteButton(true);
    }
    return () => {
      layout.setShouldRenderDeleteButton(false);
    };
  }, [isNewEntry]);

  return (
    <>
      {activity && (
        <Stack spacing={2} alignItems="center">
          <ActivityIcon activity={activity} />
          <Typography variant="h5" textAlign="center">
            {activity.name}
          </Typography>
        </Stack>
      )}
    </>
  );
}
