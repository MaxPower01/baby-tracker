import PageName from "@/common/enums/PageName";
import { formatStopwatchTime, getPath } from "@/lib/utils";
import ActivityButton from "@/modules/activities/components/ActivityButton";
import ActivityType from "@/modules/activities/enums/ActivityType";
import { ActivityModel } from "@/modules/activities/models/ActivityModel";
import { selectLastEntry } from "@/modules/entries/state/entriesSlice";
import useMenu from "@/modules/menu/hooks/useMenu";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import { RootState } from "@/modules/store/store";
import {
  Box,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function NewEntryWidget() {
  const breastFeedingActivity = new ActivityModel(ActivityType.BreastFeeding);
  const bottleFeedingActivity = new ActivityModel(ActivityType.BottleFeeding);
  const diaperActivity = new ActivityModel(ActivityType.Diaper);
  const sleepActivity = new ActivityModel(ActivityType.Sleep);
  const burpActivity = new ActivityModel(ActivityType.Burp);
  const regurgitationActivity = new ActivityModel(ActivityType.Regurgitation);
  const vomitActivity = new ActivityModel(ActivityType.Vomit);
  const { Menu, openMenu, closeMenu } = useMenu();
  const theme = useTheme();
  const lastBreastfeedingEntry = useSelector((state: RootState) =>
    selectLastEntry(state, breastFeedingActivity.type)
  );
  const lastBottleFeedingEntry = useSelector((state: RootState) =>
    selectLastEntry(state, bottleFeedingActivity.type)
  );
  const lastDiaperEntry = useSelector((state: RootState) =>
    selectLastEntry(state, diaperActivity.type)
  );
  const lastSleepEntry = useSelector((state: RootState) =>
    selectLastEntry(state, sleepActivity.type)
  );
  const lastBurpEntry = useSelector((state: RootState) =>
    selectLastEntry(state, burpActivity.type)
  );
  const lastRegurgitationEntry = useSelector((state: RootState) =>
    selectLastEntry(state, regurgitationActivity.type)
  );
  const lastVomitEntry = useSelector((state: RootState) =>
    selectLastEntry(state, vomitActivity.type)
  );
  const [forceUpdate, setForceUpdate] = useState(1);
  const lastFeedingLabel = useMemo(() => {
    if (lastBreastfeedingEntry == null) return null;
    if (lastBreastfeedingEntry.anyStopwatchIsRunning) {
      return "En cours";
    }

    const now = new Date();
    let result = "Il y a";
    const diff =
      now.getTime() - lastBreastfeedingEntry.startDate.toDate().getTime();
    result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    if (
      lastBreastfeedingEntry.leftTime > 0 &&
      lastBreastfeedingEntry.rightTime == 0
    ) {
      result += " (G)";
    } else if (
      lastBreastfeedingEntry.leftTime == 0 &&
      lastBreastfeedingEntry.rightTime > 0
    ) {
      result += " (D)";
    }
    return result;
  }, [lastBreastfeedingEntry, forceUpdate]);
  const lastBottleFeedingLabel = useMemo(() => {
    if (lastBottleFeedingEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff =
      now.getTime() - lastBottleFeedingEntry.startDate.toDate().getTime();
    result += ` ${formatStopwatchTime(diff, true, false)}`;
    return result;
  }, [lastBottleFeedingEntry, forceUpdate]);
  const lastDiaperLabel = useMemo(() => {
    if (lastDiaperEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastDiaperEntry.startDate.toDate().getTime();
    result += ` ${formatStopwatchTime(diff, true, false)}`;
    return result;
  }, [lastDiaperEntry, forceUpdate]);
  const lastSleepLabel = useMemo(() => {
    if (lastSleepEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastSleepEntry.startDate.toDate().getTime();
    result += ` ${formatStopwatchTime(diff, true, false)}`;
    return result;
  }, [lastSleepEntry, forceUpdate]);
  const lastBurpLabel = useMemo(() => {
    if (lastBurpEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastBurpEntry.startDate.toDate().getTime();
    result += ` ${formatStopwatchTime(diff, true, false)}`;
    return result;
  }, [lastBurpEntry, forceUpdate]);
  const lastRegurgitationLabel = useMemo(() => {
    if (lastRegurgitationEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff =
      now.getTime() - lastRegurgitationEntry.startDate.toDate().getTime();
    result += ` ${formatStopwatchTime(diff, true, false)}`;
    return result;
  }, [lastRegurgitationEntry, forceUpdate]);
  const lastVomitLabel = useMemo(() => {
    if (lastVomitEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastVomitEntry.startDate.toDate().getTime();
    result += ` ${formatStopwatchTime(diff, true, false)}`;
    return result;
  }, [lastVomitEntry, forceUpdate]);

  const boxStyle: SxProps = {
    borderRadius: 1,
    flexShrink: 0,
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "10em",
  };
  const activityButtonStyle: SxProps = {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
  };
  const textStyle: SxProps = {
    opacity: 0.6,
    textAlign: "center",
    fontStyle: "italic",
  };
  const textVariant = "body2";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleActivityClick = (params: {
    event: React.MouseEvent<HTMLElement, MouseEvent>;
    activity: ActivityModel;
    rightSide?: boolean;
    startTimer?: boolean;
  }) => {
    const { activity, rightSide, startTimer, event } = params;
    closeMenu(event);
    const urlParams = {
      activity: activity.type.toString(),
    } as any;
    if (startTimer) {
      if (rightSide) {
        urlParams.shouldStartTimer = "right";
      } else {
        urlParams.shouldStartTimer = "left";
      }
    }
    navigate(
      getPath({
        page: PageName.Entry,
        params: urlParams,
      })
    );
  };
  return (
    <Stack
      spacing={2}
      direction={"row"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
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
        }}
      >
        <ActivityButton
          activity={breastFeedingActivity}
          showLabel
          sx={{
            ...activityButtonStyle,
          }}
          onClick={openMenu}
        />
        {lastFeedingLabel != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastFeedingLabel}
          </Typography>
        )}
        <Menu>
          <MenuItem
            onClick={(e) => {
              handleActivityClick({
                event: e,
                activity: breastFeedingActivity,
                startTimer: true,
              });
            }}
          >
            <Stack direction={"row"} spacing={1}>
              <Typography>Côté gauche</Typography>
            </Stack>
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              handleActivityClick({
                event: e,
                activity: breastFeedingActivity,
                rightSide: true,
                startTimer: true,
              });
            }}
          >
            <Stack direction={"row"} spacing={1}>
              <Typography>Côté droit</Typography>
            </Stack>
          </MenuItem>
        </Menu>
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
          onClick={(e) => {
            handleActivityClick({ event: e, activity: bottleFeedingActivity });
          }}
        />
        {lastBottleFeedingLabel != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastBottleFeedingLabel}
          </Typography>
        )}
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
          onClick={(e) => {
            handleActivityClick({ event: e, activity: diaperActivity });
          }}
        />
        {lastDiaperEntry != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastDiaperLabel}
          </Typography>
        )}
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
          onClick={(e) => {
            handleActivityClick({
              event: e,
              activity: sleepActivity,
              startTimer: true,
            });
          }}
        />
        {lastSleepEntry != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastSleepLabel}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          ...boxStyle,
        }}
      >
        <ActivityButton
          activity={burpActivity}
          showLabel
          sx={{
            ...activityButtonStyle,
          }}
          onClick={(e) => {
            handleActivityClick({ event: e, activity: burpActivity });
          }}
        />
        {lastBurpEntry != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastBurpLabel}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          ...boxStyle,
        }}
      >
        <ActivityButton
          activity={regurgitationActivity}
          showLabel
          sx={{
            ...activityButtonStyle,
          }}
          onClick={(e) => {
            handleActivityClick({ event: e, activity: regurgitationActivity });
          }}
        />
        {lastRegurgitationEntry != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastRegurgitationLabel}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          ...boxStyle,
        }}
      >
        <ActivityButton
          activity={vomitActivity}
          showLabel
          sx={{
            ...activityButtonStyle,
          }}
          onClick={(e) => {
            handleActivityClick({ event: e, activity: vomitActivity });
          }}
        />
        {lastVomitEntry != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastVomitLabel}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
