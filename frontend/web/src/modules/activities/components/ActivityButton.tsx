import { Button, Stack, SxProps, Typography } from "@mui/material";
import { ActivityType } from "../../../lib/enums";
import { ActivityModel } from "../models/ActivityModel";
import ActivityIcon from "./ActivityIcon";

type Props = {
  activity: ActivityModel;
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
      <Stack spacing={1}>
        <ActivityIcon activity={activity} />
        {showLabel && (
          <Typography
            variant="button"
            textAlign="center"
            fontWeight={"bold"}
            lineHeight={1.2}
          >
            {activity.name}
          </Typography>
        )}
      </Stack>
    </Button>
  );
}
