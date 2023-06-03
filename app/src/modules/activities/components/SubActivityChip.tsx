import { Chip, Typography, useTheme } from "@mui/material";

import SubActivityIcon from "@/modules/activities/components/SubActivityIcon";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import SubActivityType from "@/modules/activities/enums/SubActivityType";
import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
import { useSelector } from "react-redux";

type Props = {
  subActivity: SubActivityModel;
  onClick?: (type: SubActivityType) => void;
  isSelected?: boolean;
  size?: "small" | "medium";
  textColor?: string;
  isDisabled?: boolean;
};

export default function SubActivityChip({
  subActivity,
  onClick,
  isSelected,
  size,
  textColor,
  isDisabled,
}: Props) {
  const useCompactMode = useSelector(selectUseCompactMode);
  const theme = useTheme();

  return (
    <Chip
      key={`${subActivity.type}-${subActivity.type}`}
      label={
        <Typography
          variant={useCompactMode ? "caption" : "body2"}
          fontWeight={useCompactMode ? 500 : 600}
          color={textColor}
        >
          {subActivity.name}
        </Typography>
      }
      sx={{
        border: "1px solid",
        borderColor: theme.palette.divider,
      }}
      icon={
        <SubActivityIcon
          subActivity={subActivity}
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
          onClick(subActivity.type);
        }
      }}
      size={size}
      variant={isSelected ? "filled" : "outlined"}
    />
  );
}
