import { Chip, Stack, Typography, useTheme } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import SubActivityIcon from "@/modules/activities/components/SubActivityIcon";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import SubActivityType from "@/modules/activities/enums/SubActivityType";
import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
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
  const useCompactMode = useSelector(selectUseCompactMode);
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
          <Typography
            variant={
              useCompactMode ? "caption" : size == "small" ? "body2" : "body1"
            }
            fontWeight={useCompactMode ? 500 : 600}
            color={textColor}
          >
            {subActivity.name}
          </Typography>
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
                fontSize: useCompactMode ? "1.15em" : "1.35em",
                color: theme.palette.primary.main,
              }}
            />
          )} */}
          <SubActivityIcon
            subActivity={subActivity}
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
          onClick(subActivity.type);
        }
      }}
      size={size}
      variant={isSelected || isFilled ? "filled" : "outlined"}
    />
  );
}
