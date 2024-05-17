import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  resetFiltersInState,
  selectActivityContextsInFiltersState,
  selectEntryTypesInFiltersState,
  selectSortOrderInFiltersState,
  selectTimePeriodInFiltersState,
  toggleActivityContextInFiltersState,
  toggleEntryTypeInFiltersState,
} from "@/state/slices/filtersSlice";
import { useCallback, useMemo, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextChip } from "@/pages/Activities/components/ActivityContextChip";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import { EntryTypeChip } from "@/pages/Activities/components/EntryTypeChip";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import SortIcon from "@mui/icons-material/Sort";
import { SortOrderId } from "@/enums/SortOrderId";
import { functions } from "@/firebase";
import { getActivityContextTypesItems } from "@/utils/getActivityContextTypesItems";
import { getEntryTypeIdFromActivityContextType } from "@/utils/getEntryTypeIdFromActivityContextType";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import { getSortOrderItems } from "@/utils/getSortOrderItems";
import { httpsCallable } from "firebase/functions";
import isDevelopment from "@/utils/isDevelopment";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { resetFiltersButtonId } from "@/utils/constants";
import { selectActivityContexts } from "@/state/slices/activitiesSlice";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

function FiltersSection(props: SectionProps) {
  return (
    <Stack spacing={1}>
      <Stack
        spacing={1}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        {" "}
        {props.icon}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
          }}
        >
          {props.title}
        </Typography>
      </Stack>
      {props.children}
    </Stack>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function FiltersDrawer(props: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const selectedTimePeriod = useSelector(selectTimePeriodInFiltersState);
  const selectedEntryTypes = useSelector(selectEntryTypesInFiltersState);
  const selectedSortOrder = useSelector(selectSortOrderInFiltersState);
  const selectedActivityContexts = useSelector(
    selectActivityContextsInFiltersState
  );
  const activityContexts = useSelector(selectActivityContexts);

  const activityContextTypesItems = getActivityContextTypesItems();

  const activityContextsGroups = useMemo(() => {
    const result: Array<{
      label: string;
      activityContextType: ActivityContextType;
      activityContexts: ActivityContext[];
    }> = [];
    for (const activityContextType of activityContextTypesItems) {
      const activityContextsOftype = activityContexts.filter(
        (context) => context.type == activityContextType.id
      );
      if (activityContexts.length) {
        result.push({
          label: activityContextType.label,
          activityContextType: activityContextType.id,
          activityContexts: activityContextsOftype,
        });
      }
    }
    return result;
  }, [activityContexts]);

  // const sortItems = getSortOrderItems();

  const confirmButtonLabel = useMemo(() => {
    if (selectedEntryTypes.length === 0) {
      return "Confirmer";
    } else {
      return `Confirmer (${selectedEntryTypes.length})`;
    }
  }, [selectedEntryTypes]);

  const resetButtonLabel = "Réinitialiser les filtres";

  const activitiesSectionTitle = useMemo(() => {
    if (selectedEntryTypes.length === 0) {
      return "Activités";
    } else {
      return `Activités (${selectedEntryTypes.length})`;
    }
  }, [selectedEntryTypes]);

  const toggleEntryType = useCallback(
    (entryTypeId: EntryTypeId) => {
      dispatch(toggleEntryTypeInFiltersState({ entryTypeId }));
    },
    [dispatch]
  );

  const toggleActivityContext = useCallback(
    (activityContext: ActivityContext) => {
      dispatch(toggleActivityContextInFiltersState({ activityContext }));
    },
    [dispatch]
  );

  const handleClose = useCallback(
    (action: "confirm" | "cancel" | "reset") => {
      if (action == "reset") {
        dispatch(resetFiltersInState());
      }
      props.onClose();
    },
    [
      // referenceSelectedEntryTypes,
      selectedEntryTypes,
      props,
      // referenceSelectedSortOrder,
      selectedSortOrder,
      dispatch,
    ]
  );

  const entryTypesOrder = useSelector(selectEntryTypesOrder);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={props.isOpen}
        onOpen={() => {}}
        onClose={() => props.onClose()}
        disableSwipeToOpen={true}
        autoFocus={false}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "inherit",
            backgroundImage: "inherit",
          }}
        >
          <Container maxWidth={CSSBreakpoint.Small} disableGutters>
            <Toolbar>
              <Typography variant="h6">Filtres</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => handleClose("cancel")}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
            <Divider
              sx={{
                marginLeft: 2,
                marginRight: 2,
              }}
            />
          </Container>
        </Box>
        <Container
          maxWidth={CSSBreakpoint.Small}
          sx={{
            backgroundColor: "inherit",
            backgroundImage: "inherit",
          }}
        >
          <Box
            sx={{
              maxHeight: "70vh",
              backgroundColor: "inherit",
              backgroundImage: "inherit",
            }}
          >
            <Stack
              spacing={4}
              sx={{
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              <FiltersSection title={activitiesSectionTitle}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {entryTypesOrder.map((entryTypeId) => {
                    return (
                      <EntryTypeChip
                        key={entryTypeId}
                        entryType={entryTypeId}
                        isSelected={selectedEntryTypes.includes(entryTypeId)}
                        onClick={toggleEntryType}
                      />
                    );
                  })}
                </Box>
              </FiltersSection>

              {activityContextsGroups.map((activityContextGroup) => {
                if (!activityContextGroup.activityContexts.length) {
                  return null;
                }
                const entryTypeId = getEntryTypeIdFromActivityContextType(
                  activityContextGroup.activityContextType
                );
                let title = activityContextGroup.label;
                const selectedItemsCount = selectedActivityContexts.filter(
                  (context) =>
                    context.type === activityContextGroup.activityContextType
                ).length;
                if (selectedItemsCount) {
                  title += ` (${selectedItemsCount})`;
                }
                return (
                  <FiltersSection
                    title={title}
                    icon={
                      entryTypeId == null ? undefined : (
                        <EntryTypeIcon
                          type={entryTypeId}
                          sx={{
                            fontSize: "1.5em",
                          }}
                        />
                      )
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {activityContextGroup.activityContexts.map(
                        (activityContext, index) => {
                          return (
                            <ActivityContextChip
                              key={activityContext.id}
                              // entryTypeId={entryTypeId}
                              activityContext={activityContext}
                              isSelected={selectedActivityContexts
                                .map((context) => context.id)
                                .includes(activityContext.id)}
                              onClick={toggleActivityContext}
                            />
                          );
                        }
                      )}
                    </Box>
                  </FiltersSection>
                );
              })}
            </Stack>

            <Box
              sx={{
                flexShrink: 0,
                position: "sticky",
                bottom: 0,
                backgroundColor: "inherit",
                backgroundImage: "inherit",
                paddingTop: 1,
                paddingBottom: 1,
                width: "100%",
              }}
            >
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => handleClose("confirm")}
                  fullWidth
                  size="large"
                  // disabled={isSaving || !props.selectedItems.length}
                  sx={{
                    height: `calc(${theme.typography.button.fontSize} * 2.5)`,
                  }}
                >
                  <Typography variant="button">{confirmButtonLabel}</Typography>
                  <Box
                    sx={{
                      // display: isSaving ? "flex" : "none",
                      display: "none",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LoadingIndicator
                      size={`calc(${theme.typography.button.fontSize} * 2)`}
                    />
                  </Box>
                </Button>

                <Button
                  id={resetFiltersButtonId}
                  variant="outlined"
                  onClick={() => handleClose("reset")}
                  fullWidth
                  size="large"
                  // disabled={isSaving || !props.selectedItems.length}
                  sx={{
                    height: `calc(${theme.typography.button.fontSize} * 2.5)`,
                  }}
                >
                  <Typography variant="button">{resetButtonLabel}</Typography>
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </SwipeableDrawer>
    </>
  );
}
