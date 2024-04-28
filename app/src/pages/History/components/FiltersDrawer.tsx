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
import { useCallback, useMemo, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ActivityChip from "@/pages/Activities/components/ActivityChip";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
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
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

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
  selectedEntryTypes: EntryTypeId[];
  setSelectedEntryTypes: React.Dispatch<React.SetStateAction<EntryTypeId[]>>;
  selectedSortOrder: SortOrderId;
  setSelectedSortOrder: React.Dispatch<React.SetStateAction<SortOrderId>>;
};

export function FiltersDrawer(props: Props) {
  const theme = useTheme();

  const entryTypes = Object.values(EntryTypeId).filter((entryTypeId) => {
    return typeof entryTypeId !== "string";
  }) as EntryTypeId[];

  const [selectedEntryTypes, setSelectedEntryTypes] = useState<EntryTypeId[]>(
    props.selectedEntryTypes
  );
  const [referenceSelectedEntryTypes, setReferenceSelectedEntryTypes] =
    useState<EntryTypeId[]>(props.selectedEntryTypes);

  const sortItems = getSortOrderItems();
  const [selectedSortOrder, setSelectedSortOrder] = useState(
    props.selectedSortOrder
  );
  const [referenceSelectedSortOrder, setReferenceSelectedSortOrder] = useState(
    props.selectedSortOrder
  );

  const confirmButtonLabel = useMemo(() => {
    if (selectedEntryTypes.length === 0) {
      return "Confirmer";
    } else {
      return `Confirmer (${selectedEntryTypes.length})`;
    }
  }, [selectedEntryTypes]);

  const activitiesSectionTitle = useMemo(() => {
    if (selectedEntryTypes.length === 0) {
      return "Activités";
    } else {
      return `Activités (${selectedEntryTypes.length})`;
    }
  }, [selectedEntryTypes]);

  const toggleEntryType = useCallback(
    (entryTypeId: EntryTypeId) => {
      const isSelected = selectedEntryTypes.includes(entryTypeId);
      if (isSelected) {
        setSelectedEntryTypes((prev) => {
          if (!prev || !prev.length) {
            return prev;
          } else if (prev.length === 1) {
            return [];
          } else {
            return prev.filter((id) => id !== entryTypeId);
          }
        });
      } else {
        setSelectedEntryTypes((prev) => {
          return [...prev, entryTypeId];
        });
      }
    },
    [selectedEntryTypes]
  );

  const handleClose = useCallback(
    (confirmed: boolean) => {
      if (confirmed) {
        setReferenceSelectedEntryTypes(selectedEntryTypes);
        setReferenceSelectedSortOrder(selectedSortOrder);
        props.setSelectedEntryTypes(selectedEntryTypes);
        props.setSelectedSortOrder(selectedSortOrder);
      } else {
        setSelectedEntryTypes(referenceSelectedEntryTypes);
        setSelectedSortOrder(referenceSelectedSortOrder);
      }
      props.onClose();
    },
    [
      referenceSelectedEntryTypes,
      selectedEntryTypes,
      props,
      referenceSelectedSortOrder,
      selectedSortOrder,
    ]
  );

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
              <IconButton onClick={() => handleClose(false)}>
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
              <FiltersSection title="Trier par">
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {sortItems.map((item) => {
                    return (
                      <Chip
                        icon={<item.Icon />}
                        label={item.label}
                        sx={{
                          "& .MuiChip-label": {
                            color:
                              item.id == selectedSortOrder
                                ? theme.customPalette.text.primary
                                : theme.customPalette.text.tertiary,
                            //   paddingLeft: 0.5,
                          },

                          "& .MuiChip-icon": {
                            color:
                              item.id == selectedSortOrder
                                ? theme.customPalette.text.secondary
                                : theme.customPalette.text.tertiary,
                            fontSize: "1.5em",
                          },
                        }}
                        variant={
                          item.id == selectedSortOrder ? "filled" : "outlined"
                        }
                        onClick={() => {
                          setSelectedSortOrder(item.id);
                        }}
                      />
                    );
                  })}
                </Box>
              </FiltersSection>

              <FiltersSection title={activitiesSectionTitle}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {entryTypes.map((entryTypeId) => {
                    return (
                      <ActivityChip
                        key={entryTypeId}
                        entryType={entryTypeId}
                        isSelected={selectedEntryTypes.includes(entryTypeId)}
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
              <Button
                variant="contained"
                onClick={() => handleClose(true)}
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
            </Box>
          </Box>
        </Container>
      </SwipeableDrawer>
    </>
  );
}
