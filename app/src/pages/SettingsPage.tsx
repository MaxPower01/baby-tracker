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
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import {
  selectGroupEntriesBy,
  selectThemeMode,
  selectUseCompactMode,
  updateGroupEntriesBy,
  updateThemeMode,
  updateUseCompactMode,
} from "@/modules/settings/state/settingsSlice";

import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import GroupEntriesBy from "@/modules/settings/enums/GroupEntriesBy";
import ThemeMode from "@/modules/theme/enums/ThemeMode";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import { useSelector } from "react-redux";

function VerticalStack(props: { children: React.ReactNode }) {
  const theme = useTheme();
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

function ItemDescription(props: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Typography
      variant={"body2"}
      color={theme.customPalette.text.secondary}
      sx={
        {
          // fontStyle: "italic",
        }
      }
      {...props}
    />
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();

  const initialTheme = useSelector(selectThemeMode);
  const [theme, setTheme] = useState(initialTheme);
  const handleThemeChange = (event: SelectChangeEvent<ThemeMode>) => {
    const newValue = event.target.value as ThemeMode;
    setTheme(newValue);
    dispatch(updateThemeMode(newValue));
  };

  const initialGroupEntriesBy = useSelector(selectGroupEntriesBy);
  const [groupEntriesBy, setGroupEntries] = useState(initialGroupEntriesBy);
  const handleGroupEntriesByChange = (
    event: SelectChangeEvent<GroupEntriesBy>
  ) => {
    const newValue = event.target.value as GroupEntriesBy;
    setGroupEntries(newValue);
    dispatch(updateGroupEntriesBy(newValue));
  };

  const initialUseCompactMode = useSelector(selectUseCompactMode);
  const [useCompactMode, setUseCompactMode] = useState(initialUseCompactMode);
  const handleCompactModeSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.checked;
    setUseCompactMode(newValue);
    dispatch(updateUseCompactMode(newValue));
  };

  return (
    <Container maxWidth={CSSBreakpoint.ExtraSmall}>
      <Stack
        sx={{
          width: "100%",
        }}
        spacing={4}
      >
        {/* <VerticalStack>
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
              <MenuItem value={ThemeMode.Dark}>Sombre</MenuItem>
              <MenuItem value={ThemeMode.Light}>Clair</MenuItem>
            </Select>
          </FormControl>
        </VerticalStack> */}

        {/* <VerticalStack>
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
              <MenuItem value={GroupEntriesBy.None}>Ne pas grouper</MenuItem>
              <MenuItem value={GroupEntriesBy.FiveMinutes}>5 minutes</MenuItem>
              <MenuItem value={GroupEntriesBy.FifteenMinutes}>
                15 minutes
              </MenuItem>
              <MenuItem value={GroupEntriesBy.ThirtyMinutes}>
                30 minutes
              </MenuItem>
              <MenuItem value={GroupEntriesBy.OneHour}>1 heure</MenuItem>
              <MenuItem value={GroupEntriesBy.TwoHours}>2 heures</MenuItem>
            </Select>
          </FormControl>
        </VerticalStack> */}

        <VerticalStack>
          {/* <InputLabel id="group-entries-select-label">
            Le mode compact permet d'afficher plus d'informations à la fois sur
            l'écran. Si vous avez de la difficulté à lire les informations, vous
            pouvez désactiver ce mode.
          </InputLabel> */}
          <ItemDescription>
            Désactivez cette option si vous trouvez que l'information affichée à
            l'écran est trop petite.
          </ItemDescription>

          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={useCompactMode}
                  onChange={handleCompactModeSwitchChange}
                  name="compact-mode-switch"
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
        </VerticalStack>
      </Stack>
    </Container>
  );
}
