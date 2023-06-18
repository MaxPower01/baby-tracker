import { Chip, Typography, useTheme } from "@mui/material";

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import CheckIcon from "@mui/icons-material/Check";
import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
import { useSelector } from "react-redux";

type Props = {
  activity: ActivityModel;
  onClick?: (type: ActivityType) => void;
  isSelected?: boolean;
  isFilled?: boolean;
  size?: "small" | "medium";
  textColor?: string;
  isDisabled?: boolean;
  overrideText?: string;
};

export default function ActivityChip({
  activity,
  onClick,
  isSelected,
  isFilled,
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
        borderColor: isSelected
          ? theme.palette.primary.main
          : theme.palette.divider,
        backgroundColor: isSelected
          ? `${theme.palette.primary.main}30`
          : undefined,
      }}
      icon={
        <>
          {isSelected == true && (
            <CheckIcon
              sx={{
                marginRight: 0,
                marginLeft: 1,
                fontSize: useCompactMode ? "1.15em" : "1.35em",
                color: theme.palette.primary.main,
              }}
            />
          )}
          <ActivityIcon
            activity={activity}
            sx={{
              marginRight: size === "small" ? -0.5 : -1,
              marginLeft: 0.5,
              fontSize: useCompactMode ? "1.15em" : "1.35em",
              color: textColor,
            }}
          />
        </>
      }
      disabled={isDisabled}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(activity.type);
        }
      }}
      size={size}
      variant={isSelected || isFilled ? "filled" : "outlined"}
    />
  );
}
