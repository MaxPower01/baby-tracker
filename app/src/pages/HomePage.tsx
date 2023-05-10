import LoadingIndicator from "@/common/components/LoadingIndicator";
import Section from "@/common/components/Section";
import SectionTitle from "@/common/components/SectionTitle";
import ActivityType from "@/modules/activities/enums/ActivityType";
import useChildren from "@/modules/children/hooks/useChildren";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import RecentEntries from "@/modules/entries/components/RecentEntries";
import useEntries from "@/modules/entries/hooks/useEntries";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { Stack, Typography } from "@mui/material";

export default function HomePage() {
  const { child } = useChildren();
  const { entries, isLoading } = useEntries();

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
          <NewEntryWidget
            lastBottleFeedingEntry={
              entries?.find(
                (entry: EntryModel) =>
                  entry?.activity?.type == ActivityType.BottleFeeding
              ) ?? null
            }
            lastBreastfeedingEntry={
              entries?.find(
                (entry: EntryModel) =>
                  entry?.activity?.type == ActivityType.BreastFeeding
              ) ?? null
            }
            lastBurpEntry={
              entries?.find(
                (entry: EntryModel) =>
                  entry?.activity?.type == ActivityType.Burp
              ) ?? null
            }
            lastDiaperEntry={
              entries?.find(
                (entry: EntryModel) =>
                  entry?.activity?.type == ActivityType.Diaper
              ) ?? null
            }
            lastSleepEntry={
              entries?.find(
                (entry: EntryModel) =>
                  entry?.activity?.type == ActivityType.Sleep
              ) ?? null
            }
            lastRegurgitationEntry={
              entries?.find(
                (entry: EntryModel) =>
                  entry?.activity?.type == ActivityType.Regurgitation
              ) ?? null
            }
            lastVomitEntry={
              entries?.find(
                (entry: EntryModel) =>
                  entry?.activity?.type == ActivityType.Vomit
              ) ?? null
            }
          />
        </MenuProvider>
      </Section>
      <Section dividerPosition="top">
        <SectionTitle title="Activité récente" />
        <RecentEntries entries={entries} isLoadingEntries={isLoading} />
      </Section>
    </Stack>
  );
}
