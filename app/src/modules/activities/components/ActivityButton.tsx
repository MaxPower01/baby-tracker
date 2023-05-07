import { Button, Stack, SxProps, Typography, useTheme } from "@mui/material";
import ActivityType from "../enums/ActivityType";
import { ActivityModel } from "../models/ActivityModel";
import ActivityIcon from "./ActivityIcon";

type Props = {
  activity: ActivityModel;
  sx?: SxProps | undefined;
  showLabel?: boolean;
  overrideLabel?: string | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  variant?: "contained" | "outlined" | undefined;
};

export default function ActivityButton({
  activity,
  sx,
  showLabel,
  overrideLabel,
  onClick,
}: Props) {
  const theme = useTheme();
  if (typeof activity.type !== "number") return null;
  if (!Object.values(ActivityType).includes(activity.type)) return null;
  return (
    <Button
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        ...sx,
        color: theme.palette.text.primary,
      }}
    >
      <Stack spacing={1}>
        <ActivityIcon activity={activity} />
        {showLabel != null && (
          <Typography
            variant="button"
            textAlign="center"
            fontWeight={"bold"}
            lineHeight={1.2}
          >
            {overrideLabel ?? activity.name}
          </Typography>
        )}
      </Stack>
    </Button>
  );
}
