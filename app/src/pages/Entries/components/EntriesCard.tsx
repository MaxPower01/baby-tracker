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
import ActivityType from "@/pages/Activities/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EntryBody from "@/pages/Entries/components/EntryBody";
import EntryHeader from "@/pages/Entries/components/EntryHeader";
import EntryModel from "@/pages/Entries/models/EntryModel";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PageId } from "@/enums/PageId";
import getPath from "@/utils/getPath";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import useEntries from "@/pages/Entries/hooks/useEntries";
import { useMenu } from "@/components/Menu/hooks/useMenu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  entries: EntryModel[];
  allEntries: EntryModel[];
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
  const dispatch = useAppDispatch();
  const [menuEntry, setMenuEntry] = useState<EntryModel | null>(null);
  const [dialogOpened, setDialogOpened] = useState(false);
  const handleDialogClose = () => setDialogOpened(false);
  const { deleteEntry } = useEntries();

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    closeMenu(e);
    if (!menuEntry) return;
    setDialogOpened(true);
  };

  const handleAddEntryButtonClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    closeMenu(e);
    if (menuEntry?.activity == null) return;
    navigate(
      getPath({
        page: PageId.Entry,
        params: { activity: menuEntry.activity.type.toString() },
      })
    );
  };

  const handleFilterEntriesButtonClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    closeMenu(e);
    if (menuEntry?.activity == null) return;
    if (props.onFilterEntriesButtonClick)
      props.onFilterEntriesButtonClick(e, menuEntry.activity.type);
  };

  const handleDeleteEntry = useCallback(() => {
    if (menuEntry?.id == null) return;
    deleteEntry(menuEntry.id).then(() => {
      handleDialogClose();
    });
  }, [menuEntry]);

  return (
    <>
      <Card
        elevation={0}
        sx={
          {
            // backgroundColor: "transparent",
            // backgroundColor: "transparent" : undefined,
            // backgroundImage: "none" : undefined,
            // border: "1px solid" : undefined,
            // borderColor: theme.palette.divider : undefined,
            // boxShadow: "none" : undefined,
          }
        }
      >
        {/* <CardHeader
        title={
          <Typography variant="subtitle1">
            {entries[0].startDate.toDate().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        }
        sx={{
          position: "sticky",
          top: 0,
        }}
      />
      <Divider
        sx={{
          marginLeft: 2,
          marginRight: 2,
        }}
      /> */}
        {entries.map((entry, entryIndex) => {
          const nextEntryExists = entryIndex < entries.length - 1;
          const entryHasStopwatchRunning =
            entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
          if (entry.id == null) return null;
          const previousEntry = allEntries
            .slice()
            // .reverse()
            .find(
              (e) =>
                e.id != null &&
                e.id != entry.id &&
                e.activity != null &&
                entry.activity != null &&
                (e.activity.type == entry.activity.type ||
                  e.linkedActivities
                    .map((a) => a.type)
                    .includes(entry.activity.type)) &&
                e.startDate.getTime() < entry.startDate.getTime()
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
                        {entry.activity != null && (
                          <ActivityIcon
                            activity={entry.activity}
                            sx={{
                              fontSize: "3.5em",
                              transform:
                                entry.activity.hasSides &&
                                entry.leftTime &&
                                !entry.rightTime
                                  ? "scaleX(-1)"
                                  : "scaleX(1)",
                            }}
                          />
                        )}
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
        <MenuItem onClick={(e) => handleAddEntryButtonClick(e)}>
          <Stack direction={"row"} spacing={1}>
            {menuEntry?.activity == null ? (
              <>
                <AddIcon />
                <Typography>Ajouter une entrée</Typography>
              </>
            ) : (
              <>
                <AddIcon />
                <Typography>{menuEntry.activity.addNewEntryLabel}</Typography>
              </>
            )}
          </Stack>
        </MenuItem>
        <MenuItem onClick={(e) => handleFilterEntriesButtonClick(e)}>
          <Stack direction={"row"} spacing={1}>
            {menuEntry?.activity == null ? (
              <>
                <FilterListIcon />
                <Typography>Afficher toutes les entrées de ce type</Typography>
              </>
            ) : (
              <>
                <FilterListIcon />
                <Typography>{menuEntry.activity.filterEntriesLabel}</Typography>
              </>
            )}
          </Stack>
        </MenuItem>
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
          <Button onClick={handleDeleteEntry}>Supprimer</Button>
          <Button onClick={handleDialogClose} autoFocus>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}