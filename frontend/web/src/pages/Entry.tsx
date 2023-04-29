import { Box, CircularProgress } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useLayout from "../common/hooks/useLayout";
import { ActivityType } from "../lib/enums";
import { isValidActivityType } from "../lib/utils";
import { Activity } from "../modules/activities/models/Activity";
import EntryForm from "../modules/entries/components/EntryForm";

export default function Entry() {
  const layout = useLayout();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check if it's a new entry or an existing one

  const isNewEntry = useMemo(() => !params.entryId, [params.entryId]);

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

  // Get the activity

  const activity = useMemo(() => {
    const activityType = searchParams.get("activity");
    if (isValidActivityType(activityType)) {
      return new Activity(Number(activityType) as ActivityType);
    } else {
      return null;
    }
  }, [searchParams]);

  if (!activity) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <EntryForm activity={activity} />;
}
