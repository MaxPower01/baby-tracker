import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useMemo } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextChip } from "@/pages/Activities/components/ActivityContextChip";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import { EntryTypeChip } from "@/pages/Activities/components/EntryTypeChip";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { FiltersProps } from "@/components/Filters/FiltersPicker";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { getActivityContextTypesItems } from "@/utils/getActivityContextTypesItems";
import { getEntryTypeIdFromActivityContextType } from "@/utils/getEntryTypeIdFromActivityContextType";
import { resetFiltersButtonId } from "@/utils/constants";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useFilters } from "@/components/Filters/FiltersProvider";
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
  filtersProps: FiltersProps;
};

export function FiltersDrawer(props: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // const selectedTimePeriod = useSelector(selectTimePeriodInFiltersState);
  // const selectedEntryTypes = useSelector(selectEntryTypesInFiltersState);
  // const selectedSortOrder = useSelector(selectSortOrderInFiltersState);
  // const selectedActivityContexts = useSelector(
  //   selectActivityContextsInFiltersState
  // );
  // const activityContexts = useSelector(selectActivityContexts);

  const {
    filtersCount,
    activityContexts,
    entryTypes,
    toggleEntryType,
    toggleActivityContext,
    reset,
  } = useFilters();

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
    if (filtersCount === 0) {
      return "Confirmer";
    } else {
      return `Confirmer (${filtersCount})`;
    }
  }, [filtersCount]);

  const resetButtonLabel = "Réinitialiser les filtres";

  const activitiesSectionTitle = useMemo(() => {
    if (entryTypes.length === 0) {
      return "Activités";
    } else {
      return `Activités (${entryTypes.length})`;
    }
  }, [entryTypes]);

  const handleClose = useCallback(
    (action: "confirm" | "cancel" | "reset") => {
      if (action == "reset") {
        reset();
      }
      props.onClose();
    },
    [props]
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
                {props.filtersProps.entryTypeIdFilterMode === "multiple" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {entryTypesOrder.map((entryTypeId, index) => {
                      return (
                        <EntryTypeChip
                          key={index}
                          entryType={entryTypeId}
                          isSelected={entryTypes.includes(entryTypeId)}
                          onClick={toggleEntryType}
                        />
                      );
                    })}
                  </Box>
                )}

                {
                  props.filtersProps.entryTypeIdFilterMode === "single" && null // TODO: implement single entry type filter
                }
              </FiltersSection>

              {activityContextsGroups.map((activityContextGroup, index) => {
                if (!activityContextGroup.activityContexts.length) {
                  return null;
                }
                const entryTypeId = getEntryTypeIdFromActivityContextType(
                  activityContextGroup.activityContextType
                );
                let title = activityContextGroup.label;
                const selectedItemsCount = activityContexts.filter(
                  (context) =>
                    context.type === activityContextGroup.activityContextType
                ).length;
                if (selectedItemsCount) {
                  title += ` (${selectedItemsCount})`;
                }
                return (
                  <FiltersSection
                    key={index}
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
                              isSelected={activityContexts
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
