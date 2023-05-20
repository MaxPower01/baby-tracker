import PageName from "@/common/enums/PageName";
import { formatStopwatchTime, getPath, isNullOrWhiteSpace } from "@/lib/utils";
import ActivityButton from "@/modules/activities/components/ActivityButton";
import ActivityType from "@/modules/activities/enums/ActivityType";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import useEntries from "@/modules/entries/hooks/useEntries";
import EntryModel from "@/modules/entries/models/EntryModel";
import useMenu from "@/modules/menu/hooks/useMenu";
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

type Props = {};

export default function NewEntryWidget(props: Props) {
  const { entries } = useEntries();
  const breastFeedingActivity = new ActivityModel(ActivityType.BreastFeeding);
  const bottleFeedingActivity = new ActivityModel(ActivityType.BottleFeeding);
  const diaperActivity = new ActivityModel(ActivityType.Diaper);
  const sleepActivity = new ActivityModel(ActivityType.Sleep);
  // const burpActivity = new ActivityModel(ActivityType.Burp);
  // const regurgitationActivity = new ActivityModel(ActivityType.Regurgitation);
  // const vomitActivity = new ActivityModel(ActivityType.Vomit);
  const { Menu, openMenu, closeMenu } = useMenu();
  const theme = useTheme();
  const [now, setNow] = useState(new Date());
  const lastBreastFeedingEntry = useMemo(() => {
    const breastFeedingEntries = entries?.filter(
      (entry: EntryModel) => entry?.activity?.type == ActivityType.BreastFeeding
    );
    breastFeedingEntries?.sort((a, b) => {
      return b?.startDate?.getTime() - a?.startDate?.getTime();
    });
    return breastFeedingEntries?.[0] ?? null;
  }, [entries, now]);
  const lastBreastfeedingLabel = useMemo(() => {
    const parts = {
      title: "",
      subtitle: "",
      isLive: false,
    };
    if (lastBreastFeedingEntry == null) return null;
    if (lastBreastFeedingEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isLive: true,
        subtitle: "",
      };
    }
    const time =
      lastBreastFeedingEntry.time > 0
        ? formatStopwatchTime(
            lastBreastFeedingEntry.time,
            true,
            lastBreastFeedingEntry.time < 1000 * 60
          )
        : null;
    if (time != null) {
      parts.title = time;
    }

    parts.subtitle = "Il y a";
    const diff = now.getTime() - lastBreastFeedingEntry.endDate.getTime();
    parts.subtitle += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    if (
      lastBreastFeedingEntry.leftTime > 0 &&
      lastBreastFeedingEntry.rightTime == 0
    ) {
      // Add dot symbol
      parts.title = "Gauche • " + parts.title;
    } else if (
      lastBreastFeedingEntry.leftTime == 0 &&
      lastBreastFeedingEntry.rightTime > 0
    ) {
      parts.title = "Droite • " + parts.title;
    }
    return parts;
  }, [lastBreastFeedingEntry, now]);
  const lastBottleFeedingEntry = useMemo(() => {
    const bottleFeedingEntries = entries?.filter(
      (entry: EntryModel) => entry?.activity?.type == ActivityType.BottleFeeding
    );
    bottleFeedingEntries?.sort((a, b) => {
      return b?.startDate?.getTime() - a?.startDate?.getTime();
    });
    return bottleFeedingEntries?.[0] ?? null;
  }, [entries, now]);
  const lastBottleFeedingLabel = useMemo(() => {
    const parts = {
      title: "",
      subtitle: "",
      isLive: false,
    };
    if (lastBottleFeedingEntry == null) return null;
    if (lastBottleFeedingEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isLive: true,
        subtitle: "",
      };
    }
    const time =
      lastBottleFeedingEntry.time > 0
        ? formatStopwatchTime(
            lastBottleFeedingEntry.time,
            true,
            lastBottleFeedingEntry.time < 1000 * 60
          )
        : null;
    parts.subtitle = "Il y a";
    const diff = now.getTime() - lastBottleFeedingEntry.endDate.getTime();
    parts.subtitle += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
  }, [lastBottleFeedingEntry, now]);
  const lastDiaperEntry = useMemo(() => {
    const diaperEntries = entries?.filter(
      (entry: EntryModel) => entry?.activity?.type == ActivityType.Diaper
    );
    diaperEntries?.sort((a, b) => {
      return b?.startDate?.getTime() - a?.startDate?.getTime();
    });
    return diaperEntries?.[0] ?? null;
  }, [entries, now]);
  const lastDiaperLabel = useMemo(() => {
    const parts = {
      title: "",
      subtitle: "",
      isLive: false,
    };
    if (lastDiaperEntry == null) return null;
    if (lastDiaperEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isLive: true,
        subtitle: "",
      };
    }
    const time = formatStopwatchTime(
      lastDiaperEntry.time,
      true,
      lastDiaperEntry.time < 1000 * 60
    );
    parts.subtitle = "Il y a";
    const diff = now.getTime() - lastDiaperEntry.endDate.getTime();
    parts.subtitle += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return parts;
  }, [lastDiaperEntry, now]);
  const lastSleepEntry = useMemo(() => {
    const sleepEntries = entries?.filter(
      (entry: EntryModel) => entry?.activity?.type == ActivityType.Sleep
    );
    sleepEntries?.sort((a, b) => {
      return b?.startDate?.getTime() - a?.startDate?.getTime();
    });
    return sleepEntries?.[0] ?? null;
  }, [entries, now]);
  const lastSleepLabel = useMemo(() => {
    const parts = {
      title: "",
      subtitle: "",
      isLive: false,
    };
    if (lastSleepEntry == null) return null;
    if (lastSleepEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isLive: true,
        subtitle: "",
      };
    }
    const time = formatStopwatchTime(
      lastSleepEntry.time,
      true,
      lastSleepEntry.time < 1000 * 60
    );
    parts.subtitle = "Il y a";
    const diff = now.getTime() - lastSleepEntry.endDate.getTime();
    parts.subtitle += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return parts;
  }, [lastSleepEntry, now]);
  // const lastBurpEntry = useMemo(() => {
  //   const burpEntries = entries?.filter(
  //     (entry: EntryModel) => entry?.activity?.type == ActivityType.Burp
  //   );
  //   burpEntries?.sort((a, b) => {
  //     return b?.startDate?.getTime() - a?.startDate?.getTime();
  //   });
  //   return burpEntries?.[0] ?? null;
  // }, [entries, now]);
  // const lastBurpLabel = useMemo(() => {
  //   if (lastBurpEntry == null) return null;
  //   if (lastBurpEntry.anyStopwatchIsRunning) {
  //     return "En cours";
  //   }
  //   const time = formatStopwatchTime(
  //     lastBurpEntry.time,
  //     true,
  //     lastBurpEntry.time < 1000 * 60
  //   );
  //   let result = time == null ? "Il y a" : `${time} il y a `;
  //   const diff = now.getTime() - lastBurpEntry.endDate.getTime();
  //   result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
  //   return result;
  // }, [lastBurpEntry, now]);
  // const lastRegurgitationEntry = useMemo(() => {
  //   const regurgitationEntries = entries?.filter(
  //     (entry: EntryModel) => entry?.activity?.type == ActivityType.Regurgitation
  //   );
  //   regurgitationEntries?.sort((a, b) => {
  //     return b?.startDate?.getTime() - a?.startDate?.getTime();
  //   });
  //   return regurgitationEntries?.[0] ?? null;
  // }, [entries, now]);
  // const lastRegurgitationLabel = useMemo(() => {
  //   if (lastRegurgitationEntry == null) return null;
  //   if (lastRegurgitationEntry.anyStopwatchIsRunning) {
  //     return "En cours";
  //   }
  //   const time = formatStopwatchTime(
  //     lastRegurgitationEntry.time,
  //     true,
  //     lastRegurgitationEntry.time < 1000 * 60
  //   );
  //   let result = time == null ? "Il y a" : `${time} il y a `;
  //   const diff = now.getTime() - lastRegurgitationEntry.endDate.getTime();
  //   result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
  //   return result;
  // }, [lastRegurgitationEntry, now]);
  // const lastVomitEntry = useMemo(() => {
  //   const vomitEntries = entries?.filter(
  //     (entry: EntryModel) => entry?.activity?.type == ActivityType.Vomit
  //   );
  //   vomitEntries?.sort((a, b) => {
  //     return b?.startDate?.getTime() - a?.startDate?.getTime();
  //   });
  //   return vomitEntries?.[0] ?? null;
  // }, [entries, now]);
  // const lastVomitLabel = useMemo(() => {
  //   if (lastVomitEntry == null) return null;
  //   if (lastVomitEntry.anyStopwatchIsRunning) {
  //     return "En cours";
  //   }
  //   const time = formatStopwatchTime(
  //     lastVomitEntry.time,
  //     true,
  //     lastVomitEntry.time < 1000 * 60
  //   );
  //   let result = time == null ? "Il y a" : `${time} il y a `;
  //   const diff = now.getTime() - lastVomitEntry.endDate.getTime();
  //   result += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
  //   return result;
  // }, [lastVomitEntry, now]);

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
    paddingTop: 1.5,
    paddingBottom: 1.5,
    paddingLeft: 2,
    paddingRight: 2,
    // width: "100%",
    // flex: 1,
    width: "10em",
    background: theme.customPalette.background?.almostTransparent,
    border: "1px solid",
    borderColor: theme.customPalette.background?.almostTransparent,
  };
  const subtitleStyle: SxProps = {
    opacity: 0.6,
    textAlign: "center",
    // fontStyle: "italic",
    // marginTop: 1,
    // fontWeight: "bold",
  };
  const titleStyle: SxProps = {
    textAlign: "center",
    // fontWeight: "bold",
    // opacity: 0.8,
    // marginTop: 1,
  };

  const textVariant = "body2";
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
      setNow(new Date());
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
        <Stack
          sx={{
            marginTop: 1,
          }}
        >
          {lastBreastfeedingLabel != null &&
            !isNullOrWhiteSpace(lastBreastfeedingLabel.subtitle) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...subtitleStyle,
                  // lineHeight: 1,
                }}
              >
                {lastBreastfeedingLabel.subtitle}
              </Typography>
            )}
          {lastBreastfeedingLabel != null &&
            !isNullOrWhiteSpace(lastBreastfeedingLabel.title) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...titleStyle,
                  color: lastBreastfeedingLabel.isLive
                    ? theme.palette.primary.main
                    : undefined,
                  // lineHeight: 1,
                }}
              >
                {lastBreastfeedingLabel.title}
              </Typography>
            )}
        </Stack>
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
              <Typography>
                Démarrer le <strong>côté gauche</strong>
              </Typography>
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
              <Typography>
                Démarrer le <strong>côté droit</strong>
              </Typography>
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
        <Stack
          sx={{
            marginTop: 1,
          }}
        >
          {lastBottleFeedingLabel != null &&
            !isNullOrWhiteSpace(lastBottleFeedingLabel.subtitle) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...subtitleStyle,
                  // lineHeight: 1,
                }}
              >
                {lastBottleFeedingLabel.subtitle}
              </Typography>
            )}
          {lastBottleFeedingLabel != null &&
            !isNullOrWhiteSpace(lastBottleFeedingLabel.title) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...titleStyle,
                  color: lastBottleFeedingLabel.isLive
                    ? theme.palette.primary.main
                    : undefined,
                  // lineHeight: 1,
                }}
              >
                {lastBottleFeedingLabel.title}
              </Typography>
            )}
        </Stack>
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
        <Stack
          sx={{
            marginTop: 1,
          }}
        >
          {lastDiaperLabel != null &&
            !isNullOrWhiteSpace(lastDiaperLabel.subtitle) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...subtitleStyle,
                  // lineHeight: 1,
                }}
              >
                {lastDiaperLabel.subtitle}
              </Typography>
            )}
          {lastDiaperLabel != null &&
            !isNullOrWhiteSpace(lastDiaperLabel.title) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...titleStyle,
                  color: lastDiaperLabel.isLive
                    ? theme.palette.primary.main
                    : undefined,
                  // lineHeight: 1,
                }}
              >
                {lastDiaperLabel.title}
              </Typography>
            )}
        </Stack>
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
        <Stack
          sx={{
            marginTop: 1,
          }}
        >
          {lastSleepLabel != null &&
            !isNullOrWhiteSpace(lastSleepLabel.subtitle) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...subtitleStyle,
                  // lineHeight: 1,
                }}
              >
                {lastSleepLabel.subtitle}
              </Typography>
            )}
          {lastSleepLabel != null &&
            !isNullOrWhiteSpace(lastSleepLabel.title) && (
              <Typography
                variant={textVariant}
                sx={{
                  ...titleStyle,
                  color: lastSleepLabel.isLive
                    ? theme.palette.primary.main
                    : undefined,
                  // lineHeight: 1,
                }}
              >
                {lastSleepLabel.title}
              </Typography>
            )}
        </Stack>
      </Box>
      {/* <Box
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
        {lastBurpLabel != null && (
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
        {lastRegurgitationLabel != null && (
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
        {lastVomitLabel != null && (
          <Typography
            variant={textVariant}
            sx={{
              ...textStyle,
            }}
          >
            {lastVomitLabel}
          </Typography>
        )}
      </Box> */}
    </Stack>
  );
}
