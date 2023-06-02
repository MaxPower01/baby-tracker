import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";

import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";

export default function SettingsPage() {
  const [theme, setTheme] = React.useState("dark");
  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    setTheme(event.target.value);
  };

  const [groupEntries, setGroupEntries] = React.useState("no");
  const handleGroupEntriesChange = (event: SelectChangeEvent<string>) => {
    setGroupEntries(event.target.value);
  };

  return (
    <Stack
      sx={{
        width: "100%",
      }}
      spacing={4}
    >
      <Stack spacing={1}>
        <InputLabel id="theme-select-label">Thème</InputLabel>
        <FormControl>
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
      </Stack>

      <Stack spacing={1}>
        <InputLabel id="group-entries-select-label">
          Grouper les entrées rapprochées
        </InputLabel>
        <FormControl>
          <Select
            labelId="group-entries-select-label"
            id="group-entries-select"
            value={groupEntries}
            onChange={handleGroupEntriesChange}
          >
            <MenuItem value={"no"}>Ne pas grouper</MenuItem>
            <MenuItem value={"15"}>15 minutes</MenuItem>
            <MenuItem value={"30"}>30 minutes</MenuItem>
            <MenuItem value={"60"}>1 heure</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
