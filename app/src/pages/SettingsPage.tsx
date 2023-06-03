import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
} from "@mui/material";
import React, { useState } from "react";
import {
  selectGroupEntriesBy,
  selectTheme,
  selectUseCompactMode,
} from "@/modules/settings/state/settingsSlice";

import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import GroupEntriesBy from "@/modules/settings/types/GroupEntriesBy";
import { useSelector } from "react-redux";

function CustomStack(props: { children: React.ReactNode }) {
  return (
    <Stack
      spacing={1}
      // direction={"row"}
      // alignItems={"center"}
      // justifyContent={"space-between"}
      {...props}
    />
  );
}

export default function SettingsPage() {
  const initialTheme = useSelector(selectTheme);
  const [theme, setTheme] = useState(initialTheme);
  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    setTheme(event.target.value as "light" | "dark");
  };

  const initialGroupEntriesBy = useSelector(selectGroupEntriesBy);
  const [groupEntriesBy, setGroupEntries] = useState(initialGroupEntriesBy);
  const handleGroupEntriesByChange = (event: SelectChangeEvent<string>) => {
    setGroupEntries(event.target.value as GroupEntriesBy);
  };

  const initialUseCompactMode = useSelector(selectUseCompactMode);
  const [useCompactMode, setUseCompactMode] = useState(initialUseCompactMode);
  const handleCompactModeSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseCompactMode(event.target.checked);
  };

  return (
    <Container maxWidth={CSSBreakpoint.ExtraSmall}>
      <Stack
        sx={{
          width: "100%",
        }}
        spacing={4}
      >
        <CustomStack>
          <InputLabel
            id="theme-select-label"
            sx={{
              flexGrow: 1,
            }}
          >
            Thème
          </InputLabel>
          <FormControl
            sx={{
              flexShrink: 0,
            }}
          >
            <Select
              labelId="theme-select-label"
              id="theme-select"
              value={theme}
              onChange={handleThemeChange}
            >
              <MenuItem value={"dark"}>Sombre</MenuItem>
              <MenuItem value={"light"}>Clair</MenuItem>
            </Select>
          </FormControl>
        </CustomStack>

        <CustomStack>
          <InputLabel id="group-entries-select-label">
            Grouper les entrées rapprochées
          </InputLabel>
          <FormControl>
            <Select
              labelId="group-entries-select-label"
              id="group-entries-select"
              value={groupEntriesBy}
              onChange={handleGroupEntriesByChange}
            >
              <MenuItem value={"none"}>Ne pas grouper</MenuItem>
              <MenuItem value={"5m"}>5 minutes</MenuItem>
              <MenuItem value={"15m"}>15 minutes</MenuItem>
              <MenuItem value={"30m"}>30 minutes</MenuItem>
              <MenuItem value={"1h"}>1 heure</MenuItem>
              <MenuItem value={"2h"}>2 heures</MenuItem>
            </Select>
          </FormControl>
        </CustomStack>

        <CustomStack>
          {/* <InputLabel id="group-entries-select-label">
            Grouper les entrées rapprochées
          </InputLabel> */}
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
              labelPlacement="start"
              slotProps={{
                typography: {
                  sx: {
                    flexGrow: 1,
                    marginLeft: -2,
                  },
                },
              }}
              sx={{}}
            />
          </FormControl>
        </CustomStack>
      </Stack>
    </Container>
  );
}
