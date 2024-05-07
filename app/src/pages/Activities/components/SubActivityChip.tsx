import { Chip, Stack, Typography, useTheme } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import SubActivityIcon from "@/pages/Activities/components/SubActivityIcon";
import { SubActivityModel } from "@/pages/Activity/models/SubActivityModel";
import SubActivityType from "@/pages/Activity/enums/SubActivityType";
import { useSelector } from "react-redux";

type Props = {
  subActivity: SubActivityModel;
  onClick?: (type: SubActivityType) => void;
  isSelected?: boolean;
  isFilled?: boolean;
  size?: "small" | "medium";
  textColor?: string;
  isDisabled?: boolean;
};

export default function SubActivityChip({
  subActivity,
  onClick,
  isSelected,
  isFilled,
  size,
  textColor,
  isDisabled,
}: Props) {
  const theme = useTheme();

  return (
    <Chip
      key={`${subActivity.type}-${subActivity.type}`}
      label={
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <Typography variant={"caption"} fontWeight={500} color={textColor}>
            {subActivity.name}
          </Typography>
          {isSelected == true && (
            <CheckIcon
              sx={{
                marginRight: 0,
                marginLeft: 1,
                fontSize: "1.15em",
                color: theme.palette.primary.main,
              }}
            />
          )}
        </Stack>
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
          {/* {isSelected == true && (
            <CheckIcon
              sx={{
                marginRight: 0,
                marginLeft: 0.5,
                fontSize: "1.15em" : "1.35em",
                color: theme.palette.primary.main,
              }}
            />
          )} */}
          <SubActivityIcon
            subActivity={subActivity}
            sx={{
              marginRight: size === "small" ? -0.5 : -1,
              marginLeft: 0.5,
              fontSize: "1.15em",
              color: textColor,
            }}
          />
        </>
      }
      disabled={isDisabled}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(subActivity.type);
        }
      }}
      size={size}
      variant={isSelected || isFilled ? "filled" : "outlined"}
    />
  );
}
