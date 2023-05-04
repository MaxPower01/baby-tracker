import PageName from "@/common/enums/PageName";
import { getPath } from "@/lib/utils";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import { Box, Card, CardActionArea, CardContent, Stack } from "@mui/material";
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
            sx={{
              backgroundColor: entryHasStopwatchRunning ? "action.hover" : "",
              border: entryHasStopwatchRunning ? "1px solid" : "",
              borderColor: entryHasStopwatchRunning ? "action.selected" : "",
            }}
          >
            <CardContent>
              <Stack
                direction={"row"}
                spacing={2}
                sx={{
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Stack spacing={1} alignItems={"center"}>
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
                  {nextEntryExists && (
                    <Box
                      sx={{
                        marginTop: "-2em !important",
                        marginBottom: "-2em !important",
                        height: "100%",
                        transform: "translateY(2.5em)",
                      }}
                    >
                      <Box
                        sx={{
                          borderLeft: "3px solid",
                          borderColor: "divider",
                          borderRadius: "9999px",
                          height: "100%",
                        }}
                      />
                    </Box>
                  )}
                </Stack>
                <Stack spacing={1}>
                  <EntryHeader entry={entry} hideIcon />
                  <EntryBody entry={entry} />
                </Stack>
              </Stack>
            </CardContent>
          </CardActionArea>
        );
      })}
    </Card>
  );
}
