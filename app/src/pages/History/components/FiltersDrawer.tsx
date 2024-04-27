import {
  Avatar,
  Box,
  Button,
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
import { PageId } from "@/enums/PageId";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import SortIcon from "@mui/icons-material/Sort";
import { functions } from "@/firebase";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
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
};

export function FiltersDrawer(props: Props) {
  const theme = useTheme();

  const entryTypes = Object.values(EntryTypeId).filter((entryTypeId) => {
    return typeof entryTypeId !== "string";
  }) as EntryTypeId[];

  const [selectedEntryTypes, setSelectedEntryTypes] = useState<EntryTypeId[]>(
    []
  );

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
              <IconButton onClick={() => props.onClose()}>
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
        <Container maxWidth={CSSBreakpoint.Small}>
          <Box
            sx={{
              maxHeight: "70vh",
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

              <FiltersSection title="Trier par">
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  Bientôt disponible
                </Typography>
              </FiltersSection>

              <FiltersSection title="Période">
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  Bientôt disponible
                </Typography>
              </FiltersSection>
            </Stack>
          </Box>
        </Container>
      </SwipeableDrawer>
    </>
  );
}
