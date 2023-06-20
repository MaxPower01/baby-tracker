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
        sx={{
          position: "relative",
        }}
      >
        <ChildInformation
          sx={{
            zIndex: 1,
          }}
        />
        {/* <svg
          viewBox="0 0 500 100"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: -1,
          }}
        >
          <path
            d="M 0 50 C 150 150 300 0 500 80 L 500 0 L 0 0"
            fill="rgb(57, 27, 112)"
          ></path>
        </svg> */}
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
