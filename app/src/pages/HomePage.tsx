import LastFeedingWarning from "@/modules/activities/components/LastFeedingWarning";
import Entries from "@/modules/entries/components/Entries";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import { Stack } from "@mui/material";

export default function HomePage() {
  return (
    <Stack spacing={4}>
      <NewEntryWidget />
      <LastFeedingWarning />

      <Entries />
    </Stack>
  );
}
