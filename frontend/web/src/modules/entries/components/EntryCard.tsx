import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { formatStopwatchTime } from "../../../lib/utils";
import ActivityIcon from "../../activities/components/ActivityIcon";
import { Entry } from "../models/Entry";

type Props = {
  entry: Entry;
};

export default function EntryCard(props: Props) {
  const { entry } = props;
  const { time, leftTime, rightTime, note, startDate, activity } = entry;
  const { hasSides } = activity;

  const timeLabels: string[] = useMemo(() => {
    let result: string[] = [];
    if (!time) return result;
    if (hasSides) {
      if (leftTime) {
        result.push(`Côté gauche: ${formatStopwatchTime(leftTime)}`);
      }
      if (rightTime) {
        result.push(`Côté droit: ${formatStopwatchTime(rightTime)}`);
      }
      if (leftTime && rightTime) {
        result.push(`Durée totale: ${formatStopwatchTime(time)}`);
      }
    } else {
      result.push(`Durée totale: ${formatStopwatchTime(time)}`);
    }
    return result;
  }, []);

  return (
    <Card>
      <CardActionArea onClick={() => {}}>
        <CardHeader
          title={
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Box
                sx={{
                  fontSize: "50%",
                }}
              >
                <ActivityIcon activity={props.entry.activity} />
              </Box>
              <Box>{props.entry.activity.name}</Box>
            </Stack>
          }
        />
        <CardContent>
          <Typography variant="body1">
            {startDate.toDate().toLocaleString()}
          </Typography>
          {timeLabels.map((label, labelIndex) => (
            <Typography key={labelIndex} variant="body1">
              {label}
            </Typography>
          ))}
          {note && <Typography variant="body1">{note}</Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
