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

import BabyWidget from "@/components/BabyWidget";
import Entries from "@/modules/entries/components/Entries";
import LoadingIndicator from "@/components/LoadingIndicator";
import MenuProvider from "@/components/Menu/MenuProvider";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import PageId from "@/enums/PageId";
import Section from "@/components/Section";
import SectionStack from "@/components/SectionStack";
import SectionTitle from "@/components/SectionTitle";
import getPath from "@/utils/getPath";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useEntries from "@/modules/entries/hooks/useEntries";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuthentication();
  const navigate = useNavigate();

  if (user?.selectedChild == null) {
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
        <MenuProvider>
          <NewEntryWidget />
        </MenuProvider>
      </Section>
      <Section>
        <Entries />
      </Section>
    </SectionStack>
  );
}
