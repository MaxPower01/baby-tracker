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
import React, { useCallback, useEffect, useState } from "react";
import {
  saveIntervalMethodByEntryTypeIdInDB,
  selectEntryTypesOrder,
  selectIntervalMethodByEntryTypeId,
  selectThemeMode,
} from "@/state/slices/settingsSlice";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { CustomBottomBar } from "@/components/CustomBottomBar";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { PageId } from "@/enums/PageId";
import { ReactSVG } from "react-svg";
import { ThemeMode } from "@/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import isDevelopment from "@/utils/isDevelopment";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useLayout } from "@/components/LayoutProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "@/components/SnackbarProvider";

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
  const navigate = useNavigate();
  const layout = useLayout();
  const { user } = useAuthentication();
  const [isSaving, setIsSaving] = React.useState(false);
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    layout.setBottomBarVisibility("hidden");
    return () => {
      layout.setBottomBarVisibility("visible");
    };
  }, []);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const entryTypesOrder = useSelector(selectEntryTypesOrder);

  const intervalMethodByEntryTypeId = useSelector(
    selectIntervalMethodByEntryTypeId
  );
  const [
    localIntervalMethodByEntryTypeId,
    setLocalIntervalMethodByEntryTypeId,
  ] = useState(
    entryTypesOrder
      .map((entryTypeId) => {
        const intervalMethod = intervalMethodByEntryTypeId.find(
          (x) => x.entryTypeId == entryTypeId
        );
        return intervalMethod ?? null;
      })
      .filter((x) => x != null) as Array<{
      entryTypeId: EntryTypeId;
      methodId: IntervalMethodId;
    }>
  );

  const saveChanges = useCallback(() => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (isSaving || user == null) {
          return resolve(false);
        }
        setIsSaving(true);
        await dispatch(
          saveIntervalMethodByEntryTypeIdInDB({
            user,
            intervalMethodByEntryTypeId: localIntervalMethodByEntryTypeId,
          })
        ).unwrap();
        setIsSaving(false);
        navigate(
          getPath({
            page: PageId.Home,
          })
        );
        return resolve(true);
      } catch (error) {
        setIsSaving(false);
        showSnackbar({
          id: "save-interval-method-by-entry-type-id-error",
          isOpen: true,
          message:
            "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer plus tard.",
          severity: "error",
        });
        return reject(error);
      }
    });
  }, [
    dispatch,
    localIntervalMethodByEntryTypeId,
    isSaving,
    user,
    showSnackbar,
  ]);

  return (
    <>
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
                Pour chaque type d'entrée où vous enregistrez un début et une
                fin, vous pouvez choisir comment calculer le temps écoulé entre
                2 entrées.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              {localIntervalMethodByEntryTypeId.map((intervalMethod, index) => {
                const name = getEntryTypeName(intervalMethod.entryTypeId);
                return (
                  <Stack key={index} spacing={1}>
                    <Stack
                      direction={"row"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      spacing={0.5}
                    >
                      <EntryTypeIcon
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
                        value={intervalMethod.methodId}
                        onChange={(event) => {
                          setLocalIntervalMethodByEntryTypeId((prev) => {
                            return entryTypesOrder
                              .map((entryTypeId) => {
                                const prevIntervalMethod = prev.find(
                                  (x) => x.entryTypeId == entryTypeId
                                );
                                if (
                                  prevIntervalMethod?.entryTypeId ==
                                  intervalMethod.entryTypeId
                                ) {
                                  return {
                                    entryTypeId,
                                    methodId: event.target
                                      .value as IntervalMethodId,
                                  };
                                }
                                return prevIntervalMethod ?? null;
                              })
                              .filter((x) => x != null) as Array<{
                              entryTypeId: EntryTypeId;
                              methodId: IntervalMethodId;
                            }>;
                          });
                        }}
                        size="small"
                        sx={{
                          fontSize: theme.typography.body2.fontSize,
                          color: theme.customPalette.text.tertiary,
                        }}
                      >
                        <MenuItem value={IntervalMethodId.BeginningToBeginning}>
                          Depuis le début de l'entrée précédente
                        </MenuItem>
                        <MenuItem value={IntervalMethodId.EndToBeginning}>
                          Depuis la fin de l'entrée précédente
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <CustomBottomBar
        onSaveButtonClick={saveChanges}
        saveButtonDisabled={isSaving}
        saveButtonLoading={isSaving}
      />
    </>
  );
}
