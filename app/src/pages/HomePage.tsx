import { Stack, Typography } from "@mui/material";

import Entries from "@/modules/entries/components/Entries";
import LoadingIndicator from "@/common/components/LoadingIndicator";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import Section from "@/common/components/Section";
import SectionStack from "@/common/components/SectionStack";
import SectionTitle from "@/common/components/SectionTitle";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useEntries from "@/modules/entries/hooks/useEntries";

export default function HomePage() {
  const { user, children } = useAuthentication();
  const { entries, isLoading } = useEntries();

  if (user?.selectedChild == null) {
    return <LoadingIndicator />;
  }

  return (
    <SectionStack>
      <Section>
        {/* <SectionTitle title="Ajouter une entrée" /> */}
        <MenuProvider>
          <NewEntryWidget />
        </MenuProvider>
      </Section>
      <Section dividerPosition="top">
        {/* <SectionTitle title="Activité récente" /> */}
        <Entries />
      </Section>
    </SectionStack>
  );
}
