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
import { useCallback, useState } from "react";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryBody from "@/pages/Entries/components/EntryBody";
import EntryHeader from "@/pages/Entries/components/EntryHeader";
import EntryModel from "@/pages/Entry/models/EntryModel";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PageId } from "@/enums/PageId";
import getPath from "@/utils/getPath";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useEntries } from "@/pages/Entries/hooks/useEntries";
import { useMenu } from "@/components/MenuProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
  allEntries: Entry[];
  onFilterEntriesButtonClick?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    activityType: ActivityType
  ) => void;
};

export default function EntriesCard(props: Props) {
  const navigate = useNavigate();
  const { entries, allEntries } = props;
  if (!entries || entries.length === 0) return null;
  const theme = useTheme();
  const { Menu, openMenu, closeMenu } = useMenu();
  const [menuEntry, setMenuEntry] = useState<Entry | null>(null);
  const [dialogOpened, setDialogOpened] = useState(false);
  const handleDialogClose = () => setDialogOpened(false);
  // const { deleteEntry } = useEntries();

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    closeMenu(e);
    if (!menuEntry) return;
    setDialogOpened(true);
  };

  const handleDeleteEntry = useCallback(() => {
    if (menuEntry?.id == null) return;
    // deleteEntry(menuEntry.id).then(() => {
    //   handleDialogClose();
    // });
  }, [menuEntry]);

  return (
    <>
      <Card elevation={0} sx={{}}>
        {entries.map((entry, entryIndex) => {
          const nextEntryExists = entryIndex < entries.length - 1;
          const entryHasStopwatchRunning =
            entry.stopwatch?.isRunning ||
            entry.stopwatches?.some((s) => s.isRunning);
          if (entry.id == null) return null;
          const previousEntry = allEntries
            .slice()
            .find(
              (e) =>
                e.id != entry.id &&
                e.entryType == entry.entryType &&
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
                  backgroundColor: "transparent",
                }}
                component={Box}
              >
                <CardContent
                  sx={{
                    paddingTop: 1,
                    paddingBottom: 1,
                    // borderBottom:
                    //   nextEntryExists && "1px solid" : undefined,
                    // borderColor: theme.palette.divider,
                  }}
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
                          top: "3em",
                          left: "calc(2.25em - 2px)",
                          height: "100%",
                          opacity: 0.5,
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
                          backgroundColor: entryHasStopwatchRunning
                            ? `${theme.palette.primary.main}30`
                            : "transparent",
                          flexShrink: 0,
                          zIndex: 1,
                          borderColor: entryHasStopwatchRunning
                            ? `${theme.palette.primary.main}50`
                            : "transparent",
                          boxShadow: entryHasStopwatchRunning
                            ? `0 0 5px 0px ${theme.palette.primary.main}`
                            : "",
                        }}
                      >
                        {/* <ActivityIcon
                            activity={entry.entryType}
                            sx={{
                              fontSize: "3.5em",
                              transform:
                                entry.activity.hasSides &&
                                entry.leftTime &&
                                !entry.rightTime
                                  ? "scaleX(-1)"
                                  : "scaleX(1)",
                            }}
                          /> */}
                      </Box>
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        spacing={2}
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <EntryHeader
                          entry={entry}
                          hideIcon
                          textColor={
                            entryHasStopwatchRunning
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
                          paddingTop: 0,
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
        open={dialogOpened}
        onClose={handleDialogClose}
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
          <Button onClick={handleDialogClose} autoFocus>
            Annuler
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteEntry}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
