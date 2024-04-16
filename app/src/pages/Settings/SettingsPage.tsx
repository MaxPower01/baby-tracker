import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import {
  selectGroupEntriesBy,
  selectGroupEntriesInterval,
  selectIntervalMethodByEntryTypeId,
  selectShowPoopQuantityInHomePage,
  selectShowUrineQuantityInHomePage,
  selectThemeMode,
  selectWeightUnit,
  updateGroupingIntervalByEntryTypeId,
} from "@/state/slices/settingsSlice";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethod } from "@/pages/Settings/enums/IntervalMethod";
import { ReactSVG } from "react-svg";
import { ThemeMode } from "@/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import isDevelopment from "@/utils/isDevelopment";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useSelector } from "react-redux";

type VerticalStackProps = {
  children: React.ReactNode;
  sx?: SxProps;
};

function VerticalStack(props: VerticalStackProps) {
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

type ItemLabelProps = {
  label: string;
  icon?: string;
};

function ItemLabel(props: ItemLabelProps) {
  const theme = useTheme();
  return (
    <Stack
      spacing={1}
      direction={"row"}
      justifyContent={"flex-start"}
      alignItems={"center"}
    >
      {props.icon != null && (
        <Box
          sx={{
            fontSize: "1.5rem",
          }}
        >
          <ReactSVG src={`/icons/${props.icon}.svg`} className="Icon" />
        </Box>
      )}
      <Typography variant="body1" color={theme.customPalette.text.secondary}>
        {props.label}
      </Typography>
    </Stack>
  );
}

function ItemDescription(props: { text: string }) {
  const theme = useTheme();
  return (
    <Typography
      variant={"body2"}
      color={theme.customPalette.text.secondary}
      fontStyle={"italic"}
    >
      {props.text}
    </Typography>
  );
}

export function SettingsPage() {
  const dispatch = useAppDispatch();

  const theme = useTheme();
  // const initialThemeMode = useSelector(selectThemeMode);
  // const [themeMode, setThemeMode] = useState(initialThemeMode);
  // const handleThemeChange = (event: SelectChangeEvent<ThemeMode>) => {
  //   const newValue = event.target.value as ThemeMode;
  //   setThemeMode(newValue);
  //   dispatch(updateThemeMode(newValue));
  // };

  // const initialGroupEntriesBy = useSelector(selectGroupEntriesBy);
  // const [groupEntriesBy, setGroupEntries] = useState<GroupEntriesBy>(
  //   initialGroupEntriesBy
  // );
  // const handleGroupEntriesByChange = (
  //   event: SelectChangeEvent<GroupEntriesBy>
  // ) => {
  //   const newValue = event.target.value as GroupEntriesBy;
  //   setGroupEntries(newValue);
  //   dispatch(updateGroupEntriesBy(newValue));
  // };

  // const initialGroupEntriesInterval = useSelector(selectGroupEntriesInterval);
  // const [groupEntriesInterval, setGroupEntriesInterval] =
  //   useState<GroupEntriesInterval>(initialGroupEntriesInterval);
  // const handleGroupEntriesIntervalChange = (
  //   event: SelectChangeEvent<GroupEntriesInterval>
  // ) => {
  //   const newValue = event.target.value as GroupEntriesInterval;
  //   setGroupEntriesInterval(newValue);
  //   dispatch(updateGroupEntriesInterval(newValue));
  // };

  // const initialWeightUnit = useSelector(selectWeightUnit);
  // const [weightUnit, setWeightUnit] = useState<WeightUnit>(initialWeightUnit);
  // const handleWeightUnitChange = (event: SelectChangeEvent<WeightUnit>) => {
  //   const newValue = event.target.value as WeightUnit;
  //   setWeightUnit(newValue);
  //   dispatch(updateWeightUnit(newValue));
  // };

  // const initialShowPoopQuantityInHomePage = useSelector(
  //   selectShowPoopQuantityInHomePage
  // );
  // const [showPoopQuantityInHomePage, setShowPoopQuantityInHomePage] =
  //   useState<boolean>(initialShowPoopQuantityInHomePage);

  // const handleShowPoopQuantityInHomePageChange = (checked: boolean) => {
  //   const newValue = checked;
  //   setShowPoopQuantityInHomePage(newValue);
  //   dispatch(updateShowPoopQuantityInHomePage(newValue));
  // };

  // const initialShowUrineQuantityInHomePage = useSelector(
  //   selectShowUrineQuantityInHomePage
  // );
  // const [showUrineQuantityInHomePage, setShowUrineQuantityInHomePage] =
  //   useState<boolean>(initialShowUrineQuantityInHomePage);

  // const handleShowUrineQuantityInHomePageChange = (checked: boolean) => {
  //   const newValue = checked;
  //   setShowUrineQuantityInHomePage(newValue);
  //   dispatch(updateShowUrineQuantityInHomePage(newValue));
  // };

  const intervalMethodByEntryTypeId = useSelector(
    selectIntervalMethodByEntryTypeId
  );

  return (
    <Container maxWidth={CSSBreakpoint.ExtraSmall}>
      <Stack
        sx={{
          width: "100%",
        }}
        spacing={4}
      >
        <Stack spacing={2}>
          <Stack spacing={0}>
            <Typography variant={"h6"} gutterBottom>
              Calcul du temps écoulé entre 2 entrées
            </Typography>
            <Typography
              variant={"body2"}
              sx={{
                color: theme.customPalette.text.tertiary,
              }}
            >
              Pour chaque type d'entrée où vous enregistrez un début et une fin,
              vous pouvez choisir comment calculer le temps écoulé entre 2
              entrées.
            </Typography>
          </Stack>
          <Stack spacing={2}>
            {intervalMethodByEntryTypeId.map((intervalMethod, index) => {
              const name = getEntryTypeName(intervalMethod.entryTypeId);
              return (
                <Stack key={index} spacing={1}>
                  <Stack
                    direction={"row"}
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    spacing={0.5}
                  >
                    <ActivityIcon
                      type={intervalMethod.entryTypeId}
                      sx={{
                        fontSize: theme.typography.h5.fontSize,
                      }}
                    />
                    <Typography
                      variant={"body2"}
                      color={theme.customPalette.text.secondary}
                    >
                      {name}
                    </Typography>
                  </Stack>
                  <FormControl variant="outlined">
                    <Select
                      id="grouping-intervals-select"
                      value={intervalMethod.method}
                      onChange={(event) => {
                        dispatch(
                          updateGroupingIntervalByEntryTypeId({
                            entryTypeId: intervalMethod.entryTypeId,
                            method: event.target.value as IntervalMethod,
                          })
                        );
                      }}
                      size="small"
                      sx={{
                        fontSize: theme.typography.body2.fontSize,
                        color: theme.customPalette.text.tertiary,
                      }}
                    >
                      <MenuItem value={IntervalMethod.BeginningToBeginning}>
                        Depuis le début de l'entrée précédente
                      </MenuItem>
                      <MenuItem value={IntervalMethod.EndToBeginning}>
                        Depuis la fin de l'entrée précédente
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
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
          <ItemLabel label={"Grouper les entrées rapprochées"} />
          <FormControl variant="outlined">
            <Select
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

        {/* <VerticalStack>
          <ItemLabel label={"Intervalle de regroupement"} />
          <FormControl
            variant="outlined"
            sx={{
              opacity: groupEntriesBy == GroupEntriesBy.None ? 0.5 : 1,
            }}
          >
            <Select
              id="grouping-intervals-select"
              value={groupEntriesInterval}
              onChange={handleGroupEntriesIntervalChange}
              disabled={groupEntriesBy == GroupEntriesBy.None}
            >
              <MenuItem value={GroupEntriesInterval.BetweenBeginnings}>
                Entre le début des entrées
              </MenuItem>
              <MenuItem value={GroupEntriesInterval.BetweenEndsAndBeginnings}>
                Entre la fin et le début
              </MenuItem>
            </Select>
          </FormControl>
        </VerticalStack> */}

        {/* <VerticalStack>
          <ItemLabel label={"Unité de poids"} />
          <FormControl>
            <Select
              id="weight-unit-select"
              value={weightUnit}
              onChange={handleWeightUnitChange}
            >
              <MenuItem value={WeightUnit.Kilogram}>Kilogramme</MenuItem>
              <MenuItem value={WeightUnit.Pound}>Livre</MenuItem>
            </Select>
          </FormControl>
        </VerticalStack> */}

        {/* <VerticalStack>
          <ItemLabel
            label={
              "Afficher les quantités de pipi et de caca sur la page d'accueil"
            }
          />
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <ActivityIcon
                type={EntryTypeId.Poop}
                sx={{
                  fontSize: "1.5rem",
                }}
              />
              <Typography variant={"body1"}>Caca</Typography>
            </Stack>
            <FormControl>
              <Switch
                checked={showPoopQuantityInHomePage}
                onChange={(event, checked) => {
                  handleShowPoopQuantityInHomePageChange(checked);
                }}
              />
            </FormControl>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <ActivityIcon
                type={EntryTypeId.Urine}
                sx={{
                  fontSize: "1.5rem",
                }}
              />
              <Typography variant={"body1"}>Pipi</Typography>
            </Stack>
            <FormControl>
              <Switch
                checked={showUrineQuantityInHomePage}
                onChange={(event, checked) => {
                  handleShowUrineQuantityInHomePageChange(checked);
                }}
              />
            </FormControl>
          </Stack>
        </VerticalStack> */}
      </Stack>
    </Container>
  );
}
