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

import Entries from "@/modules/entries/components/Entries";
import LoadingIndicator from "@/common/components/LoadingIndicator";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import NewEntryWidget from "@/modules/entries/components/NewEntryWidget";
import Section from "@/common/components/Section";
import SectionStack from "@/common/components/SectionStack";
import SectionTitle from "@/common/components/SectionTitle";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useEntries from "@/modules/entries/hooks/useEntries";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuthentication();
  const [useCompactMode, setUseCompactMode] = useState(false);

  const handleCompactModeSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseCompactMode(event.target.checked);
  };

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
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={useCompactMode}
                onChange={handleCompactModeSwitchChange}
                name="useCompactMode"
              />
            }
            label="Mode compact"
          />
        </FormControl>
        <Entries useCompactMode={useCompactMode} />
      </Section>
    </SectionStack>
  );
}
