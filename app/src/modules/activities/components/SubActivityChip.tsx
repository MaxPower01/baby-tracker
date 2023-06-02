import { Chip, Typography, useTheme } from "@mui/material";

import SubActivityIcon from "@/modules/activities/components/SubActivityIcon";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import SubActivityType from "@/modules/activities/enums/SubActivityType";

type Props = {
  subActivity: SubActivityModel;
  onClick?: (type: SubActivityType) => void;
  isSelected?: boolean;
  size?: "small" | "medium";
  textColor?: string;
  isDisabled?: boolean;
  useCompactMode?: boolean;
};

export default function SubActivityChip({
  subActivity,
  onClick,
  isSelected,
  size,
  textColor,
  isDisabled,
  useCompactMode,
}: Props) {
  const theme = useTheme();
  return (
    <Chip
      key={`${subActivity.type}-${subActivity.type}`}
      label={
        <Typography variant="body2" fontWeight={600} color={textColor}>
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
