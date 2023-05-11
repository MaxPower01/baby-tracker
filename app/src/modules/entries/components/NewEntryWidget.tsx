import PageName from "@/common/enums/PageName";
import { formatStopwatchTime, getPath } from "@/lib/utils";
import ActivityButton from "@/modules/activities/components/ActivityButton";
import ActivityType from "@/modules/activities/enums/ActivityType";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import EntryModel from "@/modules/entries/models/EntryModel";
import useMenu from "@/modules/menu/hooks/useMenu";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import {
  Box,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  lastBreastfeedingEntry: EntryModel | null;
  lastBottleFeedingEntry: EntryModel | null;
  lastDiaperEntry: EntryModel | null;
  lastSleepEntry: EntryModel | null;
  lastBurpEntry: EntryModel | null;
  lastRegurgitationEntry: EntryModel | null;
  lastVomitEntry: EntryModel | null;
};

export default function NewEntryWidget(props: Props) {
  const {
    lastBreastfeedingEntry,
    lastBottleFeedingEntry,
    lastDiaperEntry,
    lastSleepEntry,
    lastBurpEntry,
    lastRegurgitationEntry,
    lastVomitEntry,
  } = props;
  const breastFeedingActivity = new ActivityModel(ActivityType.BreastFeeding);
  const bottleFeedingActivity = new ActivityModel(ActivityType.BottleFeeding);
  const diaperActivity = new ActivityModel(ActivityType.Diaper);
  const sleepActivity = new ActivityModel(ActivityType.Sleep);
  const burpActivity = new ActivityModel(ActivityType.Burp);
  const regurgitationActivity = new ActivityModel(ActivityType.Regurgitation);
  const vomitActivity = new ActivityModel(ActivityType.Vomit);
  const { Menu, openMenu, closeMenu } = useMenu();
  const theme = useTheme();
  // const lastBreastfeedingEntry = useSelector((state: RootState) =>
  //   selectLastEntry(state, breastFeedingActivity.type)
  // );
  // const lastBottleFeedingEntry = useSelector((state: RootState) =>
  //   selectLastEntry(state, bottleFeedingActivity.type)
  // );
  // const lastDiaperEntry = useSelector((state: RootState) =>
  //   selectLastEntry(state, diaperActivity.type)
  // );
  // const lastSleepEntry = useSelector((state: RootState) =>
  //   selectLastEntry(state, sleepActivity.type)
  // );
  // const lastBurpEntry = useSelector((state: RootState) =>
  //   selectLastEntry(state, burpActivity.type)
  // );
  // const lastRegurgitationEntry = useSelector((state: RootState) =>
  //   selectLastEntry(state, regurgitationActivity.type)
  // );
  // const lastVomitEntry = useSelector((state: RootState) =>
  //   selectLastEntry(state, vomitActivity.type)
  // );
  const [forceUpdate, setForceUpdate] = useState(1);
  const lastBreastfeedingLabel = useMemo(() => {
    if (lastBreastfeedingEntry == null) return null;
    if (lastBreastfeedingEntry.anyStopwatchIsRunning) {
      return "En cours";
    }
    const now = new Date();
    const time =
      lastBreastfeedingEntry.time > 0
        ? formatStopwatchTime(
            lastBreastfeedingEntry.time,
            true,
            lastBreastfeedingEntry.time < 1000 * 60
          )
        : null;
    let result = time == null ? "Il y a" : `${time} il y a `;
    const diff = now.getTime() - lastBreastfeedingEntry.endDate.getTime();
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
    if (lastBottleFeedingEntry.anyStopwatchIsRunning) {
      return "En cours";
    }
    const time =
      lastBottleFeedingEntry.time > 0
        ? formatStopwatchTime(
            lastBottleFeedingEntry.time,
            true,
            lastBottleFeedingEntry.time < 1000 * 60
          )
        : null;
    let result = time == null ? "Il y a" : `${time} il y a `;
    const now = new Date();
    const diff = now.getTime() - lastBottleFeedingEntry.endDate.getTime();
    result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return result;
  }, [lastBottleFeedingEntry, forceUpdate]);
  const lastDiaperLabel = useMemo(() => {
    if (lastDiaperEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastDiaperEntry.endDate.getTime();
    result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return result;
  }, [lastDiaperEntry, forceUpdate]);
  const lastSleepLabel = useMemo(() => {
    if (lastSleepEntry == null) return null;
    if (lastSleepEntry.anyStopwatchIsRunning) {
      return "En cours";
    }
    const time =
      lastSleepEntry.time > 0
        ? formatStopwatchTime(
            lastSleepEntry.time,
            true,
            lastSleepEntry.time < 1000 * 60
          )
        : null;
    let result = time == null ? "Il y a" : `${time} il y a `;
    const now = new Date();
    const diff = now.getTime() - lastSleepEntry.endDate.getTime();
    result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return result;
  }, [lastSleepEntry, forceUpdate]);
  const lastBurpLabel = useMemo(() => {
    if (lastBurpEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastBurpEntry.endDate.getTime();
    result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return result;
  }, [lastBurpEntry, forceUpdate]);
  const lastRegurgitationLabel = useMemo(() => {
    if (lastRegurgitationEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastRegurgitationEntry.endDate.getTime();
    result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return result;
  }, [lastRegurgitationEntry, forceUpdate]);
  const lastVomitLabel = useMemo(() => {
    if (lastVomitEntry == null) return null;
    const now = new Date();
    let result = "Il y a";
    const diff = now.getTime() - lastVomitEntry.endDate.getTime();
    result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
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
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Stack
      spacing={2}
      direction={"row"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      sx={{
        "& .ActivityIcon": {
          fontSize: "4em",
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
        {lastBreastfeedingLabel != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastBreastfeedingLabel}
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
