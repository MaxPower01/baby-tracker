import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  deleteEntryInDB,
  selectRecentEntries,
} from "@/state/slices/entriesSlice";
import { useCallback, useState } from "react";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryBody } from "@/pages/Entry/components/EntryBody";
import { EntryHeader } from "@/pages/Entry/components/EntryHeader";
import EntryModel from "@/pages/Entry/models/EntryModel";
import FilterListIcon from "@mui/icons-material/FilterList";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PageId } from "@/enums/PageId";
import { entryHasStopwatchRunning } from "@/pages/Entry/utils/entryHasStopwatchRunning";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import getPath from "@/utils/getPath";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useMenu } from "@/components/MenuProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
  onFilterEntriesButtonClick?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    activityType: ActivityType
  ) => void;
};

export function EntriesCard(props: Props) {
  const navigate = useNavigate();
  const { entries } = props;
  const dispatch = useAppDispatch();
  const { user } = useAuthentication();
  const babyId = user?.babyId ?? "";
  const allEntries = useSelector(selectRecentEntries);
  if (!entries || entries.length === 0) return null;
  const theme = useTheme();
  const { Menu, openMenu, closeMenu } = useMenu();
  const [menuEntry, setMenuEntry] = useState<Entry | null>(null);
  const [deleteEntrydialogIsOpen, setDeleteEntryDialogIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteEntryDialogClose = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setDeleteEntryDialogIsOpen(false);
  }, [isDeleting]);

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    closeMenu(e);
    if (!menuEntry) return;
    setDeleteEntryDialogIsOpen(true);
  };

  const handleDeleteEntry = useCallback(async () => {
    if (menuEntry?.id == null || user?.babyId == null) {
      return;
    }
    setIsDeleting(true);
    try {
      await dispatch(
        deleteEntryInDB({
          entryId: menuEntry.id,
          timestamp: menuEntry.startTimestamp,
          babyId: user.babyId,
        })
      ).unwrap();
      setIsDeleting(false);
      handleDeleteEntryDialogClose();
    } catch (error) {
      setIsDeleting(false);
    }
  }, [menuEntry, user, dispatch, handleDeleteEntryDialogClose]);

  return (
    <>
      <Card>
        {entries.map((entry, entryIndex) => {
          const nextEntryExists = entryIndex < entries.length - 1;
          const stopwatchRunning = entryHasStopwatchRunning(entry);
          if (entry.id == null) return null;
          const previousEntry = allEntries
            .slice()
            .find(
              (e) =>
                e.id != entry.id &&
                e.entryTypeId == entry.entryTypeId &&
                e.startTimestamp < entry.startTimestamp
            );

          return (
            <Box key={entry.id}>
              <CardActionArea
                onClick={() => {
                  navigate(
                    getPath({
                      page: PageId.Entry,
                      id: entry.id ?? "",
                    })
                  );
                }}
                sx={{
                  borderRadius: 0,
                  // backgroundColor: "transparent",
                }}
                component={Box}
              >
                <CardContent
                  sx={
                    {
                      // paddingTop: 1,
                      // paddingBottom: 1,
                      // borderBottom:
                      //   nextEntryExists && "1px solid" : undefined,
                      // borderColor: theme.palette.divider,
                    }
                  }
                >
                  <Stack
                    sx={{
                      fontSize: "0.65em",
                      position: "relative",
                    }}
                  >
                    {nextEntryExists && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "3.65em",
                          left: "calc(2.25em - 2px)",
                          height: "100%",
                          // opacity: 0.5,
                          paddingTop: 2.5,
                          paddingBottom: 2.5,
                          // display: "none" : undefined,
                        }}
                      >
                        <Box
                          sx={{
                            borderLeft: "4px solid",
                            borderColor: "divider",
                            borderRadius: "9999px",
                            height: "100%",
                          }}
                        ></Box>
                      </Box>
                    )}
                    <Stack
                      direction={"row"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      spacing={2}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "4.5em",
                          height: "4.5em",
                          borderRadius: "50%",
                          border: "1px solid",
                          // backgroundColor: theme.customPalette.background.avatar,
                          backgroundColor: stopwatchRunning
                            ? `${theme.palette.primary.main}30`
                            : "transparent",
                          flexShrink: 0,
                          zIndex: 1,
                          borderColor: stopwatchRunning
                            ? `${theme.palette.primary.main}50`
                            : "transparent",
                          boxShadow: stopwatchRunning
                            ? `0 0 5px 0px ${theme.palette.primary.main}`
                            : "",
                        }}
                      >
                        <ActivityIcon
                          type={entry.entryTypeId}
                          sx={{
                            fontSize: "3.5em",
                            transform:
                              entryTypeHasSides(entry.entryTypeId) &&
                              entry.leftTime &&
                              !entry.rightTime
                                ? "scaleX(-1)"
                                : "scaleX(1)",
                          }}
                        />
                      </Box>
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        spacing={2}
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <EntryHeader
                          entry={entry}
                          hideIcon
                          textColor={
                            stopwatchRunning
                              ? theme.palette.primary.main
                              : undefined
                          }
                        />
                        <IconButton
                          sx={{
                            opacity: 0.5,
                            zIndex: 1,
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setMenuEntry(entry);
                            openMenu(event);
                          }}
                          size="large"
                        >
                          <MoreVertIcon fontSize="medium" />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      spacing={2}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "4.5em",
                          borderRadius: "50%",
                          borderColor: "transparent",
                          flexShrink: 0,
                        }}
                      />
                      <EntryBody
                        entry={entry}
                        previousEntry={previousEntry}
                        sx={{
                          paddingTop: 1,
                        }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>

              {/* {nextEntryExists && (
                <Divider
                  sx={{
                    marginLeft: 2,
                    marginRight: 2,
                    opacity: 0.5,
                  }}
                />
              )} */}
            </Box>
          );
        })}
      </Card>

      <Menu>
        <MenuItem onClick={(e) => handleDeleteButtonClick(e)}>
          <Stack direction={"row"} spacing={1}>
            <DeleteIcon />
            <Typography>Supprimer</Typography>
          </Stack>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteEntrydialogIsOpen}
        onClose={handleDeleteEntryDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Voulez-vous vraiment supprimer cette entrée ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteEntryDialogClose}
            autoFocus
            sx={{
              height: `calc(${theme.typography.button.fontSize} * 2.5)`,
            }}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteEntry}
            disabled={isDeleting}
            sx={{
              height: `calc(${theme.typography.button.fontSize} * 2.5)`,
            }}
          >
            <Typography variant="button">Supprimer l'entrée</Typography>
            <Box
              sx={{
                display: isDeleting ? "flex" : "none",
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
        </DialogActions>
      </Dialog>
    </>
  );
}
