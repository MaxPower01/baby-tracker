export default function Entries() {
  const { entries, isLoading } = useEntries();
  console.log("entries", entries);

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
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </Stack>
  );
}
import { Box, CircularProgress, Stack } from "@mui/material";
import useEntries from "../hooks/useEntries";
import EntryCard from "./EntryCard";
