import LoadingIndicator from "@/common/components/LoadingIndicator";
import Section from "@/common/components/Section";
import SectionTitle from "@/common/components/SectionTitle";
import { isNullOrWhiteSpace } from "@/lib/utils";
import ActivityType from "@/modules/activities/enums/ActivityType";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import RecentEntries from "@/modules/entries/components/RecentEntries";
import useEntries from "@/modules/entries/hooks/useEntries";
import EntryModel from "@/modules/entries/models/EntryModel";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";

export default function HomePage() {
  const { user, children } = useAuthentication();
  const { entries, isLoading } = useEntries();
  const selectedChild = useMemo(() => {
    if (user == null) {
      return null;
    }
    if (isNullOrWhiteSpace(user.selectedChild)) {
      return null;
    }
    return children.find((child) => child.id == user.selectedChild);
  }, [user, children]);

  if (user?.selectedChild == null) {
    return <LoadingIndicator />;
  }

  return (
    <Stack spacing={2}>
      {(children?.length ?? 0) > 0 && (
        <Stack>
          {children.map((child) => {
            if (child.isSelected == false) {
              return null;
            }
            return (
              <Stack key={child.id}>
                <Typography variant={"h4"} textAlign={"center"}>
                  {child.name}
                </Typography>
                <Typography
                  variant={"body2"}
                  textAlign={"center"}
                  sx={{
                    opacity: 0.5,
                  }}
                >
                  {child.id}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      )}
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
