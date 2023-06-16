import { Chip, Typography, useTheme } from "@mui/material";

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
import { useSelector } from "react-redux";

type Props = {
  activity: ActivityModel;
  onClick?: (type: ActivityType) => void;
  isSelected?: boolean;
  size?: "small" | "medium";
  textColor?: string;
  isDisabled?: boolean;
  overrideText?: string;
};

export default function ActivityChip({
  activity,
  onClick,
  isSelected,
  size,
  textColor,
  isDisabled,
  overrideText,
}: Props) {
  const useCompactMode = useSelector(selectUseCompactMode);
  const theme = useTheme();
  return (
    <Chip
      key={`${activity.type}-${activity.type}`}
      label={
        <Typography
          variant={
            useCompactMode ? "caption" : size == "small" ? "body2" : "body1"
          }
          fontWeight={useCompactMode ? 500 : 600}
          color={textColor}
        >
          {overrideText ?? activity.name}
        </Typography>
      }
      sx={{
        border: "1px solid",
        borderColor: theme.palette.divider,
      }}
      icon={
        <ActivityIcon
          activity={activity}
          sx={{
            marginRight: size === "small" ? -0.5 : -1,
            marginLeft: 0.5,
            fontSize: useCompactMode ? "1.15em" : "1.35em",
            color: textColor,
          }}
        />
      }
      disabled={isDisabled}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(activity.type);
        }
      }}
      // color={isSelectable ? "primary" : undefined}
      size={size}
      variant={isSelected ? "filled" : "outlined"}
    />
  );
}
