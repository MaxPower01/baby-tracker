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

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import EntryBody from "@/modules/entries/components/EntryBody";
import EntryHeader from "@/modules/entries/components/EntryHeader";
import EntryModel from "@/modules/entries/models/EntryModel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PageId from "@/common/enums/PageId";
import getPath from "@/utils/getPath";
import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import useEntries from "@/modules/entries/hooks/useEntries";
import useMenu from "@/modules/menu/hooks/useMenu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  entries: EntryModel[];
  allEntries: EntryModel[];
};

export default function EntriesCard(props: Props) {
  const navigate = useNavigate();
  const { entries, allEntries } = props;
  const useCompactMode = useSelector(selectUseCompactMode);
  if (!entries || entries.length === 0) return null;
  const theme = useTheme();
  const { Menu, openMenu, closeMenu } = useMenu();
  const dispatch = useAppDispatch();
  const [menuEntryId, setMenuEntryId] = useState<string | null>(null);
  const [dialogOpened, setDialogOpened] = useState(false);
  const handleDialogClose = () => setDialogOpened(false);
  const { deleteEntry } = useEntries();

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    closeMenu(e);
    if (!menuEntryId) return;
    setDialogOpened(true);
  };

  const handleDeleteEntry = useCallback(() => {
    if (!menuEntryId) return;
    deleteEntry(menuEntryId).then(() => {
      handleDialogClose();
    });
  }, [menuEntryId]);

  return (
    <>
      <Card
        sx={
          {
            // backgroundColor: useCompactMode ? "transparent" : undefined,
            // backgroundImage: useCompactMode ? "none" : undefined,
            // border: useCompactMode ? "1px solid" : undefined,
            // borderColor: useCompactMode ? theme.palette.divider : undefined,
            // boxShadow: useCompactMode ? "none" : undefined,
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
                e.activity?.type == entry.activity?.type &&
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
                    paddingTop: useCompactMode ? 1 : 4,
                    paddingBottom: useCompactMode ? 1 : 4,
                    // borderBottom:
                    //   nextEntryExists && useCompactMode ? "1px solid" : undefined,
                    // borderColor: theme.palette.divider,
                  }}
                >
                  <Stack
                    sx={{
                      fontSize: useCompactMode ? "0.65em" : "0.8em",
                      position: "relative",
                    }}
                  >
                    {nextEntryExists && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "4.75em",
                          left: "calc(2.25em - 2px)",
                          height: "100%",
                          opacity: 0.5,
                          paddingTop: 1,
                          paddingBottom: 1,
                          display: useCompactMode ? "none" : undefined,
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
                            ? theme.palette.primary.main
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
                            setMenuEntryId(entry.id);
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
                          paddingTop: useCompactMode ? 0 : 1,
                        }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>

              {nextEntryExists && useCompactMode && (
                <Divider
                  sx={{
                    marginLeft: 2,
                    marginRight: 2,
                    opacity: 0.5,
                  }}
                />
              )}
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
          <Button onClick={handleDeleteEntry}>Supprimer</Button>
          <Button onClick={handleDialogClose} autoFocus>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
