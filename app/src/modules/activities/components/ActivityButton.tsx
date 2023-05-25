import {
  Button,
  Stack,
  SvgIconTypeMap,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type Props = {
  activity: ActivityModel | null;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
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
  Icon,
}: Props) {
  const theme = useTheme();
  if (activity != null && typeof activity.type !== "number") return null;
  if (activity != null && !Object.values(ActivityType).includes(activity.type))
    return null;
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
      <Stack spacing={1} justifyContent={"center"} alignItems={"center"}>
        {activity != null && (
          <>
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
          </>
        )}
        {Icon != null && (
          <>
            <Icon
              sx={{
                flexGrow: 1,
              }}
            />
            {showLabel != null && overrideLabel != null && (
              <Typography
                variant="button"
                textAlign="center"
                fontWeight={400}
                lineHeight={1.2}
              >
                {overrideLabel}
              </Typography>
            )}
          </>
        )}
      </Stack>
    </Button>
  );
}
