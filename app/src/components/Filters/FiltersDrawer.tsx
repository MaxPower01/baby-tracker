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
  selectEntryTypesInFiltersState,
  selectSortOrderInFiltersState,
  selectTimePeriodInFiltersState,
  toggleEntryTypeInFiltersState,
} from "@/state/slices/filtersSlice";
import { useCallback, useMemo, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import { EntryTypeChip } from "@/pages/Activities/components/EntryTypeChip";
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
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import { getSortOrderItems } from "@/utils/getSortOrderItems";
import { httpsCallable } from "firebase/functions";
import isDevelopment from "@/utils/isDevelopment";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { resetFiltersButtonId } from "@/utils/constants";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function FiltersSection(props: SectionProps) {
  return (
    <Stack spacing={1}>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
        }}
      >
        {props.title}
      </Typography>
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

  const timePeriod = useSelector(selectTimePeriodInFiltersState);
  const entryTypes = useSelector(selectEntryTypesInFiltersState);
  const sortOrder = useSelector(selectSortOrderInFiltersState);

  // const sortItems = getSortOrderItems();

  const confirmButtonLabel = useMemo(() => {
    if (entryTypes.length === 0) {
      return "Confirmer";
    } else {
      return `Confirmer (${entryTypes.length})`;
    }
  }, [entryTypes]);

  const resetButtonLabel = "Réinitialiser les filtres";

  const activitiesSectionTitle = useMemo(() => {
    if (entryTypes.length === 0) {
      return "Activités";
    } else {
      return `Activités (${entryTypes.length})`;
    }
  }, [entryTypes]);

  const toggleEntryType = useCallback(
    (entryTypeId: EntryTypeId) => {
      dispatch(toggleEntryTypeInFiltersState({ entryTypeId }));
    },
    [dispatch]
  );

  const handleClose = useCallback(
    (action: "confirm" | "cancel" | "reset") => {
      console.log("🚀 ~ FiltersDrawer ~ action:", action);
      // if (action === "confirm") {
      //   setReferenceSelectedEntryTypes(entryTypes);
      //   setReferenceSelectedSortOrder(sortOrder);
      //   props.setSelectedEntryTypes(entryTypes);
      //   props.setSelectedSortOrder(sortOrder);
      // } else if (action === "cancel") {
      //   setSelectedEntryTypes(referenceSelectedEntryTypes);
      //   setSelectedSortOrder(referenceSelectedSortOrder);
      // } else {
      //   setSelectedEntryTypes([]);
      //   props.setSelectedEntryTypes([]);
      // }
      if (action == "reset") {
        dispatch(resetFiltersInState());
      }
      props.onClose();
    },
    [
      // referenceSelectedEntryTypes,
      entryTypes,
      props,
      // referenceSelectedSortOrder,
      sortOrder,
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
                        isSelected={entryTypes.includes(entryTypeId)}
                        onClick={toggleEntryType}
                      />
                    );
                  })}
                </Box>
              </FiltersSection>
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
