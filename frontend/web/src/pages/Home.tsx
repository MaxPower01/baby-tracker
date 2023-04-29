import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { formatStopwatchTime } from "../lib/utils";
import useEntries from "../modules/entries/hooks/useEntries";

export default function Home() {
  const { entries, isLoading } = useEntries();

  if (isLoading) {
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

  if (!entries.length) {
    return <div>Aucune entrée</div>;
  }

  return (
    <Stack spacing={2}>
      {entries.map((entry) => (
        <Box key={entry.id}>
          <Typography variant="h5">{entry.activity.name}</Typography>
          <Typography variant="subtitle1"></Typography>
          <Typography variant="body1">
            Date: {entry.dateTime.toString()}
            {entry.durationInSeconds &&
              ` • Durée: ${formatStopwatchTime(entry.durationInSeconds)}`}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
