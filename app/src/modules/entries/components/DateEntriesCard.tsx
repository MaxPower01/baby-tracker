import PageName from "@/common/enums/PageName";
import { getPath } from "@/lib/utils";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EntryModel } from "../models/EntryModel";
import EntryBody from "./Entry/EntryBody";
import EntryHeader from "./Entry/EntryHeader";

type Props = {
  entries: EntryModel[];
};

export default function DateEntriesCard(props: Props) {
  const navigate = useNavigate();
  const { entries } = props;
  if (!entries || entries.length === 0) return null;
  const theme = useTheme();
  return (
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
                      top: "5.25em",
                      left: "calc(2.25em - 2px)",
                      borderLeft: "4px solid",
                      borderColor: "divider",
                      borderRadius: "9999px",
                      height: "100%",
                      opacity: 0.5,
                    }}
                  />
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
                  <EntryHeader
                    entry={entry}
                    hideIcon
                    textColor={
                      entryHasStopwatchRunning
                        ? theme.palette.primary.main
                        : undefined
                    }
                  />
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
  );
}
