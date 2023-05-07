import Entries from "@/modules/entries/components/Entries";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { Divider, Stack } from "@mui/material";

export default function HomePage() {
  return (
    <Stack spacing={4}>
      <MenuProvider>
        <NewEntryWidget />
      </MenuProvider>
      <Divider />
      <Entries />
    </Stack>
  );
}
