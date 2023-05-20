import PageName from "@/common/enums/PageName";
import { getPath } from "@/lib/utils";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import EntryBody from "@/modules/entries/components/EntryBody";
import EntryHeader from "@/modules/entries/components/EntryHeader";
import useEntries from "@/modules/entries/hooks/useEntries";
import EntryModel from "@/modules/entries/models/EntryModel";
import useMenu from "@/modules/menu/hooks/useMenu";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  IconButton,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  entries: EntryModel[];
};

export default function EntriesCard(props: Props) {
  const navigate = useNavigate();
  const { entries } = props;
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
      <Card>
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
          return (
            <CardActionArea
              key={entry.id}
              onClick={() => {
                navigate(
                  getPath({
                    page: PageName.Entry,
                    id: entry.id ?? "",
                  })
                );
              }}
              sx={{}}
              component={Box}
            >
              <CardContent
                sx={{
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                <Stack
                  sx={{
                    fontSize: "0.8em",
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
                        backgroundColor: theme.palette.divider,
                        flexShrink: 0,
                        zIndex: 1,
                        borderColor: entryHasStopwatchRunning
                          ? theme.palette.primary.main
                          : theme.palette.divider,
                        boxShadow: entryHasStopwatchRunning
                          ? `0 0 5px 0px ${theme.palette.primary.main}`
                          : "",
                      }}
                    >
                      {entry.activity != null && (
                        <ActivityIcon
                          activity={entry.activity}
                          sx={{
                            fontSize: "3em",
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
                      sx={{
                        paddingTop: 1,
                      }}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </CardActionArea>
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
