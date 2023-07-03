import { Chip, Stack, Typography, useTheme } from "@mui/material";

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import CheckIcon from "@mui/icons-material/Check";
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
  const theme = useTheme();
  return (
    <Chip
      key={`${activity.type}-${activity.type}`}
      label={
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <Typography variant={"caption"} fontWeight={500} color={textColor}>
            {overrideText ?? activity.name}
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
                marginLeft: 1,
                fontSize: "1.15em" : "1.35em",
                color: theme.palette.primary.main,
              }}
            />
          )} */}
          <ActivityIcon
            activity={activity}
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
          onClick(activity.type);
        }
      }}
      size={size}
      variant={isSelected || isFilled ? "filled" : "outlined"}
    />
  );
}
