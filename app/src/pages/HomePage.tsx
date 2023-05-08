import LoadingIndicator from "@/common/components/LoadingIndicator";
import useChildren from "@/modules/children/hooks/useChildren";
import Entries from "@/modules/entries/components/Entries";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { Divider, Stack, Typography } from "@mui/material";

export default function HomePage() {
  const { child } = useChildren();

  if (child == null) {
    return <LoadingIndicator />;
  }

  return (
    <Stack spacing={4}>
      <Typography variant={"h4"} textAlign={"center"}>
        {child.name}
      </Typography>
      <MenuProvider>
        <NewEntryWidget />
      </MenuProvider>
      <Divider />
      <Entries />
    </Stack>
  );
}
