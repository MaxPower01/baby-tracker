import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import {
  selectEntriesStatus,
  selectRecentEntries,
} from "@/state/slices/entriesSlice";

import ActivitiesWidget from "@/pages/Activities/components/ActivitiesWidget";
import { BabyWidget } from "@/components/BabyWidget";
import Entries from "@/pages/Entries/components/Entries";
import EntriesList from "@/pages/Entries/components/EntriesList";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MenuProvider } from "@/components/MenuProvider";
import NewEntryWidget from "@/pages/Entries/components/NewEntryWidget";
import { PageId } from "@/enums/PageId";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import getPath from "@/utils/getPath";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export function HomePage() {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const entries = useSelector(selectRecentEntries);
  const entriesStatus = useSelector(selectEntriesStatus);

  if (user?.selectedChild == null) {
    return <LoadingIndicator />;
  }

  if (entriesStatus === "loading" && entries.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <SectionStack>
      <Section
        onClick={() =>
          navigate(
            getPath({
              page: PageId.Child,
              id: user.selectedChild,
            })
          )
        }
        sx={{
          position: "relative",
        }}
      >
        <BabyWidget
          sx={{
            zIndex: 1,
          }}
        />
      </Section>
      <Section>
        <ActivitiesWidget />
      </Section>
      <Section>
        <EntriesList entries={entries} />
      </Section>
    </SectionStack>
  );
}
