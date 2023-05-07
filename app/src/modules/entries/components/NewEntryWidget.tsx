import ActivityButton from "@/modules/activities/components/ActivityButton";
import ActivityType from "@/modules/activities/enums/ActivityType";
import { ActivityModel } from "@/modules/activities/models/ActivityModel";
import { Box, Stack, SxProps, useTheme } from "@mui/material";

export default function NewEntryWidget() {
  const breastFeedingActivity = new ActivityModel(ActivityType.BreastFeeding);
  const bottleFeedingActivity = new ActivityModel(ActivityType.BottleFeeding);
  const diaperActivity = new ActivityModel(ActivityType.Diaper);
  const sleepActivity = new ActivityModel(ActivityType.Sleep);
  const theme = useTheme();
  const boxStyle: SxProps = {
    backgroundColor: theme.customPalette.background.avatar,
    borderRadius: 1,
    flexShrink: 0,
  };
  const activityButtonStyle: SxProps = {
    padding: 2,
  };
  return (
    <Stack
      spacing={2}
      direction={"row"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      sx={{
        "& .ActivityIcon": {
          fontSize: "3em",
        },
        width: "100%",
        // This should be a horizontal scroller
        overflowX: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          ...boxStyle,
          "& .ActivityIcon": {
            transform: "scaleX(-1)",
          },
        }}
      >
        <ActivityButton
          activity={breastFeedingActivity}
          showLabel
          overrideLabel={`${breastFeedingActivity.name} (G)`}
          sx={{
            ...activityButtonStyle,
          }}
        />
      </Box>
      <Box
        sx={{
          ...boxStyle,
        }}
      >
        <ActivityButton
          activity={breastFeedingActivity}
          showLabel
          overrideLabel={`${breastFeedingActivity.name} (D)`}
          sx={{
            ...activityButtonStyle,
          }}
        />
      </Box>
      <Box
        sx={{
          ...boxStyle,
        }}
      >
        <ActivityButton
          activity={bottleFeedingActivity}
          showLabel
          sx={{
            ...activityButtonStyle,
          }}
        />
      </Box>
      <Box
        sx={{
          ...boxStyle,
        }}
      >
        <ActivityButton
          activity={diaperActivity}
          showLabel
          sx={{
            ...activityButtonStyle,
          }}
        />
      </Box>
      <Box
        sx={{
          ...boxStyle,
        }}
      >
        <ActivityButton
          activity={sleepActivity}
          showLabel
          sx={{
            ...activityButtonStyle,
          }}
        />
      </Box>
    </Stack>
  );
}
