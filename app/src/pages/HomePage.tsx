import LoadingIndicator from "@/common/components/LoadingIndicator";
import Section from "@/common/components/Section";
import SectionTitle from "@/common/components/SectionTitle";
import useChildren from "@/modules/children/hooks/useChildren";
import Entries from "@/modules/entries/components/Entries";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { Stack, Typography } from "@mui/material";

export default function HomePage() {
  const { child } = useChildren();

  if (child == null) {
    return <LoadingIndicator />;
  }

  return (
    <Stack spacing={2}>
      <Typography variant={"h4"} textAlign={"center"}>
        {child.name}
      </Typography>
      <Section>
        <SectionTitle title="Ajouter une entrée" />
        <MenuProvider>
          <NewEntryWidget />
        </MenuProvider>
      </Section>
      <Section dividerPosition="top">
        <SectionTitle title="Activité récente" />
        <Entries />
      </Section>
    </Stack>
  );
}
