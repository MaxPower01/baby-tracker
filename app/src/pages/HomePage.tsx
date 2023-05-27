import { Stack, Typography } from "@mui/material";

import Entries from "@/modules/entries/components/Entries";
import LoadingIndicator from "@/common/components/LoadingIndicator";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import Section from "@/common/components/Section";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useEntries from "@/modules/entries/hooks/useEntries";

export default function HomePage() {
  const { user, children } = useAuthentication();
  const { entries, isLoading } = useEntries();

  if (user?.selectedChild == null) {
    return <LoadingIndicator />;
  }

  return (
    <Stack spacing={2}>
      {(children?.length ?? 0) > 0 && (
        <Stack>
          {children.map((child) => {
            return (
              <Stack key={child.id}>
                <Typography
                  variant={"h4"}
                  textAlign={"center"}
                  fontWeight={"bold"}
                >
                  {child.name}
                </Typography>
                {/* <Typography
                  variant={"body2"}
                  textAlign={"center"}
                  sx={{
                    opacity: 0.5,
                  }}
                >
                  {child.id}
                </Typography> */}
              </Stack>
            );
          })}
        </Stack>
      )}
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
    </Stack>
  );
}
