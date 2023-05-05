import { Chip, Typography } from "@mui/material";
import ActivityType from "../enums/ActivityType";
import { ActivityModel } from "../models/ActivityModel";
import ActivityIcon from "./ActivityIcon";

type Props = {
  activity: ActivityModel;
  onClick?: (type: ActivityType) => void;
  isSelected?: boolean;
  size?: "small" | "medium";
  variant?: "outlined" | "filled";
  textColor?: string;
};

export default function ActivityChip({
  activity,
  onClick,
  isSelected,
  size,
  variant,
  textColor,
}: Props) {
  return (
    <Chip
      key={`${activity.type}-${activity.type}`}
      label={<Typography variant="body2">{activity.name}</Typography>}
      icon={
        <ActivityIcon
          activity={activity}
          sx={{
            marginRight: size === "small" ? -0.5 : -1,
            marginLeft: 0.5,
            fontSize: "1.35em",
            color: textColor,
          }}
        />
      }
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(activity.type);
        }
      }}
      color={isSelected ? "primary" : undefined}
      size={size}
      variant={variant}
    />
  );
}
