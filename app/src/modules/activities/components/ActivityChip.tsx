import { Chip, Typography } from "@mui/material";
import ActivityType from "../enums/ActivityType";
import { ActivityModel } from "../models/ActivityModel";
import ActivityIcon from "./ActivityIcon";

type Props = {
  activity: ActivityModel;
  onClick?: (type: ActivityType) => void;
  isSelected?: boolean;
  size?: "small" | "medium";
  textColor?: string;
  isSelectable: boolean;
  isDisabled?: boolean;
};

export default function ActivityChip({
  activity,
  onClick,
  isSelected,
  size,
  textColor,
  isSelectable,
  isDisabled,
}: Props) {
  return (
    <Chip
      key={`${activity.type}-${activity.type}`}
      label={
        <Typography variant="body2" fontWeight={"bold"}>
          {activity.name}
        </Typography>
      }
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
      disabled={isDisabled}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(activity.type);
        }
      }}
      color={isSelectable ? "primary" : undefined}
      size={size}
      variant={isSelected ? "filled" : "outlined"}
    />
  );
}
