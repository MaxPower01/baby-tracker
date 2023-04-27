import { Button, SxProps, Typography } from "@mui/material";
import { ActivityType } from "../../../lib/enums";
import { Activity } from "../models/Activity";
import ActivityIcon from "./ActivityIcon";

type Props = {
  activity: Activity;
  sx?: SxProps | undefined;
  showLabel?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export default function ActivityButton({
  activity,
  sx,
  showLabel,
  onClick,
}: Props) {
  if (typeof activity.type !== "number") return null;
  if (!Object.values(ActivityType).includes(activity.type)) return null;
  return (
    <Button
      variant="text"
      color="inherit"
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        ...sx,
      }}
    >
      <ActivityIcon activity={activity} />
      {showLabel && (
        <Typography variant="button" textAlign="center">
          {activity.name}
        </Typography>
      )}
    </Button>
  );
}
