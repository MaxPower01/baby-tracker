import SubActivityIcon from "@/modules/activities/components/SubActivityIcon";
import SubActivityType from "@/modules/activities/enums/SubActivityType";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import { Chip, Typography } from "@mui/material";
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
  return (
    <Chip
      key={`${subActivity.type}-${subActivity.type}`}
      label={
        <Typography variant="body2" fontWeight={"bold"}>
          {subActivity.name}
        </Typography>
      }
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
