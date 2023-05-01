import { SxProps, Typography } from "@mui/material";
import { useMemo } from "react";
import { formatStopwatchTime } from "../../../../lib/utils";
import { EntryModel } from "../../models/EntryModel";

type Props = {
  entry: EntryModel;
};

export default function EntryBody(props: Props) {
  const { entry } = props;
  if (!entry) return null;
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
    } else {
      result.push(`Durée : ${formatStopwatchTime(time)}`);
    }
    return result;
  }, []);

  const shouldRenderCardContent = useMemo(() => {
    return timeLabels.length > 0 || note;
  }, []);

  if (!shouldRenderCardContent) return null;

  const textStyle: SxProps = {
    fontStyle: "italic",
    opacity: 0.8,
  };

  return (
    <>
      {timeLabels.map((label, labelIndex) => (
        <Typography key={labelIndex} variant="body1" sx={textStyle}>
          {label}
        </Typography>
      ))}
      {note && (
        <Typography variant="body1" sx={textStyle}>
          {note}
        </Typography>
      )}
    </>
  );
}
