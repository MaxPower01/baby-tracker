import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageName } from "../../../lib/enums";
import { getPath } from "../../../lib/utils";
import ActivityIcon from "../../activities/components/ActivityIcon";
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
    <Card elevation={12}>
      <CardHeader
        title={entries[0].startDate.toDate().toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        sx={{
          position: "sticky",
          top: 0,
        }}
      />
      {entries.map((entry, entryIndex) => {
        const nextEntryExists = entryIndex < entries.length - 1;
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
          >
            <CardContent>
              <Stack direction={"row"} spacing={2}>
                <Stack
                  spacing={1}
                  alignItems={"center"}
                  sx={{
                    fontSize: "100%",
                  }}
                >
                  <ActivityIcon
                    activity={entry.activity}
                    sx={{
                      transform:
                        entry.activity.hasSides &&
                        entry.leftTime &&
                        !entry.rightTime
                          ? "scaleX(-1)"
                          : "scaleX(1)",
                    }}
                  />
                  {nextEntryExists && (
                    <Box
                      sx={{
                        marginTop: "-0.5em !important",
                        marginBottom: "-0.5em !important",
                        height: "100%",
                        transform: "translateY(1.1em)",
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
                <Stack spacing={2}>
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
