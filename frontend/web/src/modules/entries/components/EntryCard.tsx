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
import { useNavigate } from "react-router-dom";
import { PageName } from "../../../lib/enums";
import { formatStopwatchTime, getPath } from "../../../lib/utils";
import ActivityIcon from "../../activities/components/ActivityIcon";
import { EntryModel } from "../models/EntryModel";

type Props = {
  entry: EntryModel;
};

export default function EntryCard(props: Props) {
  const navigate = useNavigate();

  const { entry } = props;
  if (!entry) return null;
  const { time, leftTime, rightTime, note, startDate, activity } = entry;
  const { hasSides } = activity;

  const title = useMemo(() => {
    let result = `${activity.name}`;
    if (time && hasSides) {
      if (leftTime && !rightTime) {
        result += ` (Gauche)`;
      } else if (!leftTime && rightTime) {
        result += ` (Droite)`;
      }
    }
    return result;
  }, []);

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
      //   if (leftTime && rightTime) {
      //     result.push(`Durée totale: ${formatStopwatchTime(time)}`);
      //   }
    } else {
      result.push(`Durée : ${formatStopwatchTime(time)}`);
    }
    return result;
  }, []);

  const shouldRenderCardContent = useMemo(() => {
    return timeLabels.length > 0 || note;
  }, []);

  return (
    <Card elevation={12}>
      <CardActionArea
        onClick={() => {
          navigate(
            getPath({
              page: PageName.Entry,
              id: props.entry.id,
            })
          );
        }}
      >
        <CardHeader
          title={
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Box
                sx={{
                  fontSize: "60%",
                }}
              >
                <ActivityIcon activity={props.entry.activity} />
              </Box>
              <Stack>
                <Typography variant="body2">
                  {startDate.toDate().toLocaleString()}
                </Typography>
                <Typography variant="h6" fontWeight={"bold"}>
                  {title}
                </Typography>
              </Stack>
            </Stack>
          }
        />
        {shouldRenderCardContent && (
          <CardContent>
            {timeLabels.map((label, labelIndex) => (
              <Typography key={labelIndex} variant="body1">
                {label}
              </Typography>
            ))}
            {note && <Typography variant="body1">{note}</Typography>}
          </CardContent>
        )}
      </CardActionArea>
    </Card>
  );
}
