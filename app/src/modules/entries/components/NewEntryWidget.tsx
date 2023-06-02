import {
  Box,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import {
  formatStopwatchTime,
  getPath,
  isNullOrWhiteSpace,
} from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";

import ActivitiesDrawer from "@/modules/activities/components/ActivitiesDrawer";
import ActivityButton from "@/modules/activities/components/ActivityButton";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import EntryModel from "@/modules/entries/models/EntryModel";
import PageName from "@/common/enums/PageName";
import useEntries from "@/modules/entries/hooks/useEntries";
import useMenu from "@/modules/menu/hooks/useMenu";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function NewEntryWidget(props: Props) {
  const { entries } = useEntries();

  const [activitiesDrawerIsOpen, setActivitiesDrawerIsOpen] = useState(false);
  const [menuDrawerIsOpen, setMenuDrawerIsOpen] = useState(false);
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
  const allActivitiesWithLastEntry = useMemo(() => {
    const activities = Object.values(ActivityType)
      .map((type) => {
        if (typeof type === "string") return null;
        return new ActivityModel(type);
      })
      .filter((activity) => activity != null)
      .sort((a, b) => {
        if (a == null || b == null) return 0;
        return a.order - b.order;
      }) as ActivityModel[];

    return activities.map((activity) => {
      const activityEntries = entries?.filter(
        (entry: EntryModel) => entry?.activity?.type == activity.type
      );
      const lastActivityEntry = activityEntries?.[0] ?? null;
      const isInProgress = lastActivityEntry?.anyStopwatchIsRunning ?? false;
      const lastEntryLabels = {
        title: activity.getLastEntryTitle(lastActivityEntry, now),
        subtitle: activity.getLastEntrySubtitle(lastActivityEntry, now),
      };
      return {
        activity,
        isInProgress,
        lastEntry: lastActivityEntry,
        lastEntryLabels,
      };
    });
  }, [entries, now]);
  const lastBreastfeedingEntry = useMemo(() => {
    const breastfeedingEntries = entries?.filter(
      (entry: EntryModel) => entry?.activity?.type == ActivityType.BreastFeeding
    );
    breastfeedingEntries?.sort((a, b) => {
      return b?.startDate?.getTime() - a?.startDate?.getTime();
    });
    return breastfeedingEntries?.[0] ?? null;
  }, [entries, now]);
  const lastBreastfeedingLabel = useMemo(() => {
    const parts = {
      title: "",
      subtitle: "",
      isInProgress: false,
    };
    if (lastBreastfeedingEntry == null) return null;
    if (lastBreastfeedingEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isInProgress: true,
        subtitle: "",
      };
    }
    const time =
      lastBreastfeedingEntry.time > 0
        ? formatStopwatchTime(
            lastBreastfeedingEntry.time,
            true,
            lastBreastfeedingEntry.time < 1000 * 60
          )
        : null;
    if (time != null) {
      parts.title = time;
    }

    parts.subtitle = "Il y a";
    const diff = now.getTime() - lastBreastfeedingEntry.endDate.getTime();
    parts.subtitle += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    if (
      lastBreastfeedingEntry.leftTime > 0 &&
      lastBreastfeedingEntry.rightTime == 0
    ) {
      // Add dot symbol
      parts.title = "Gauche • " + parts.title;
    } else if (
      lastBreastfeedingEntry.leftTime == 0 &&
      lastBreastfeedingEntry.rightTime > 0
    ) {
      parts.title = "Droite • " + parts.title;
    }
    return parts;
  }, [lastBreastfeedingEntry, now]);
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
      isInProgress: false,
    };
    if (lastBottleFeedingEntry == null) return null;
    if (lastBottleFeedingEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isInProgress: true,
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
    const volume = lastBottleFeedingEntry.volume;
    if (volume != null) {
      parts.title = `${volume} ml`;
    } else if (time != null) {
      parts.title = time;
    }
    parts.subtitle = "Il y a";
    const diff = now.getTime() - lastBottleFeedingEntry.endDate.getTime();
    parts.subtitle += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return parts;
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
      isInProgress: false,
    };
    if (lastDiaperEntry == null) return null;
    if (lastDiaperEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isInProgress: true,
        subtitle: "",
      };
    }
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
      isInProgress: false,
    };
    if (lastSleepEntry == null) return null;
    if (lastSleepEntry.anyStopwatchIsRunning) {
      return {
        title: "En cours",
        isInProgress: true,
        subtitle: "",
      };
    }
    const time =
      lastSleepEntry.time > 0
        ? formatStopwatchTime(
            lastSleepEntry.time,
            true,
            lastSleepEntry.time < 1000 * 60
          )
        : null;
    if (time != null) {
      parts.title = time;
    }
    parts.subtitle = "Il y a";
    const diff = now.getTime() - lastSleepEntry.endDate.getTime();
    parts.subtitle += ` ${formatStopwatchTime(diff, true, diff < 1000 * 60)}`;
    return parts;
  }, [lastSleepEntry, now]);

  const activityButtonWidth = "12em";
  const activityButtonPaddingLeftRight = 2;

  const boxStyle: SxProps = {
    borderRadius: 1,
    flexShrink: 0,
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    // width: "10em",
    // marginLeft: 1,
    // marginRight: 1,
    height: "100%",
  };
  const activityButtonStyle: SxProps = {
    paddingTop: 1.5,
    paddingBottom: 1.5,
    paddingLeft: activityButtonPaddingLeftRight,
    paddingRight: activityButtonPaddingLeftRight,
    // width: "100%",
    // flex: 1,
    width: activityButtonWidth,
    backgroundColor: theme.customPalette.background?.almostTransparent,
    border: "1px solid",
    borderColor: theme.customPalette.background?.almostTransparent,
    flexGrow: 1,
    height: "100%",
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
    lastEntry?: EntryModel;
    data?: {
      title: string;
      subtitle: string;
      isInProgress: boolean;
    } | null;
  }) => {
    const {
      activity,
      rightSide,
      startTimer,
      event,
      lastEntry,
      data: label,
    } = params;
    closeMenu(event);
    if (lastEntry != null && label != null) {
      if (label.isInProgress) {
        navigate(
          getPath({
            page: PageName.Entry,
            id: lastEntry.id ?? "",
          })
        );
        return;
      }
    }
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
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Stack
        // spacing={2}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        sx={{
          paddingTop: 0.5,
          paddingBottom: 0.5,
          "& .ActivityIcon": {
            fontSize: "4em",
          },
          display: "grid",
          gap: 2,
          gridTemplateColumns: `${allActivitiesWithLastEntry
            .map(() => "1fr")
            .join(" ")}`,
        }}
      >
        {allActivitiesWithLastEntry.map(
          ({ activity, lastEntry, isInProgress, lastEntryLabels }) => {
            return (
              <Box
                key={activity.type}
                sx={{
                  ...boxStyle,
                  order: isInProgress ? 0 : activity.order,
                }}
              >
                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: isInProgress
                      ? (theme.palette.primary.main as string)
                      : "transparent",
                    backgroundColor: isInProgress
                      ? `${theme.palette.primary.main}20`
                      : undefined,
                    boxShadow: isInProgress
                      ? `0 0 5px 0px ${theme.palette.primary.main}`
                      : undefined,
                    borderRadius: 1,
                    flexGrow: 1,
                    width: "100%",
                  }}
                >
                  <ActivityButton
                    activity={activity}
                    showLabel
                    sx={{
                      ...activityButtonStyle,
                    }}
                    onClick={(e) => {
                      handleActivityClick({
                        event: e,
                        activity: activity,
                        startTimer: false,
                        lastEntry: lastEntry,
                        data: {
                          title: "",
                          isInProgress: isInProgress,
                          subtitle: "",
                        },
                      });
                    }}
                  />
                </Box>
                {/* <Stack
                  sx={{
                    marginTop: 1,
                  }}
                >
                  {!isNullOrWhiteSpace(lastEntryLabels.subtitle) && (
                    <Typography
                      variant={textVariant}
                      sx={{
                        ...subtitleStyle,
                        // lineHeight: 1,
                      }}
                    >
                      {lastEntryLabels.subtitle}
                    </Typography>
                  )}
                  {!isNullOrWhiteSpace(lastEntryLabels.title) && (
                    <Typography
                      variant={textVariant}
                      sx={{
                        ...titleStyle,
                        color: isInProgress
                          ? theme.palette.primary.main
                          : undefined,
                        // lineHeight: 1,
                      }}
                    >
                      {lastEntryLabels.title}
                    </Typography>
                  )}
                </Stack> */}
              </Box>
            );
          }
        )}
      </Stack>

      <Stack
        // spacing={2}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        sx={{
          paddingTop: 0.5,
          paddingBottom: 0.5,
          "& .ActivityIcon": {
            fontSize: "4em",
          },
          width: "100%",
          display: "grid",
          gap: 2,
          gridTemplateColumns: `${allActivitiesWithLastEntry
            .map(() => "1fr")
            .join(" ")}`,
        }}
      >
        {allActivitiesWithLastEntry.map(
          ({ activity, lastEntry, isInProgress, lastEntryLabels }) => {
            return (
              <Stack
                key={activity.type}
                sx={{
                  marginTop: 1,
                  fontSize: theme.typography.button.fontSize,
                  width: `calc(${activityButtonWidth} + 1.5px)`,
                  paddingLeft: activityButtonPaddingLeftRight,
                  paddingRight: activityButtonPaddingLeftRight,
                }}
              >
                <Typography
                  variant={textVariant}
                  sx={{
                    ...subtitleStyle,
                    // lineHeight: 1,
                  }}
                >
                  {lastEntryLabels.subtitle ?? ""}
                </Typography>
                <Typography
                  variant={textVariant}
                  sx={{
                    ...titleStyle,
                    color: isInProgress
                      ? theme.palette.primary.main
                      : undefined,
                    fontWeight: isInProgress ? "bold" : undefined,
                    // lineHeight: 1,
                  }}
                >
                  {lastEntryLabels.title ?? ""}
                </Typography>
              </Stack>
            );
          }
        )}
      </Stack>
    </Box>
  );
}
