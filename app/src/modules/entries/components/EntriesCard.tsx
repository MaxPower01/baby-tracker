import PageName from "@/common/enums/PageName";
import { getPath } from "@/lib/utils";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import useMenu from "@/modules/menu/hooks/useMenu";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntryModel } from "../models/EntryModel";
import { removeEntry } from "../state/entriesSlice";
import EntryBody from "./Entry/EntryBody";
import EntryHeader from "./Entry/EntryHeader";

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

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    closeMenu(e);
    if (!menuEntryId) return;
    dispatch(removeEntry(menuEntryId));
  };

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
          return (
            <CardActionArea
              key={entry.id}
              onClick={() => {
                navigate(
                  getPath({
                    page: PageName.Entry,
                    id: entry.id,
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
                        border: "2px solid",
                        backgroundColor: theme.customPalette.background.avatar,
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
                      textColor={
                        entryHasStopwatchRunning
                          ? theme.palette.primary.main
                          : undefined
                      }
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
    </>
  );
}

import DeleteIcon from "@mui/icons-material/Delete";
