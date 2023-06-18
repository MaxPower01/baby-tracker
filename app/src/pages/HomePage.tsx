import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import ChildInformation from "@/modules/children/components/ChildInformation";
import Entries from "@/modules/entries/components/Entries";
import LoadingIndicator from "@/common/components/LoadingIndicator";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import PageId from "@/common/enums/PageId";
import Section from "@/common/components/Section";
import SectionStack from "@/common/components/SectionStack";
import SectionTitle from "@/common/components/SectionTitle";
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
      >
        <ChildInformation />
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
