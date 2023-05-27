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

  const boxStyle: SxProps = {
    borderRadius: 1,
    flexShrink: 0,
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "10em",
    marginLeft: 1,
    marginRight: 1,
    height: "100%",
  };
  const activityButtonStyle: SxProps = {
    paddingTop: 1.5,
    paddingBottom: 1.5,
    paddingLeft: 2,
    paddingRight: 2,
    // width: "100%",
    // flex: 1,
    width: "10em",
    backgroundColor: theme.customPalette.background?.almostTransparent,
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
    lastEntry?: EntryModel;
    label?: {
      title: string;
      subtitle: string;
      isInProgress: boolean;
    } | null;
  }) => {
    const { activity, rightSide, startTimer, event, lastEntry, label } = params;
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
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
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
          overflowX: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // display: "grid",
          // gridTemplateColumns: "repeat(5, minmax(10em, 1fr))",
        }}
      >
        <Box
          sx={{
            ...boxStyle,
            order: lastBreastfeedingLabel?.isInProgress ? 0 : 1,
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: lastBreastfeedingLabel?.isInProgress
                ? (theme.palette.primary.main as string)
                : "transparent",
              backgroundColor: lastBreastfeedingLabel?.isInProgress
                ? `${theme.palette.primary.main}20`
                : undefined,
              boxShadow: lastBreastfeedingLabel?.isInProgress
                ? `0 0 5px 0px ${theme.palette.primary.main}`
                : undefined,
              borderRadius: 1,
            }}
          >
            <ActivityButton
              activity={breastFeedingActivity}
              showLabel
              sx={{
                ...activityButtonStyle,
              }}
              onClick={(e) => {
                if (lastBreastfeedingLabel?.isInProgress) {
                  handleActivityClick({
                    event: e,
                    activity: breastFeedingActivity,
                    lastEntry: lastBreastfeedingEntry,
                    label: lastBreastfeedingLabel,
                  });
                } else {
                  openMenu(e);
                }
              }}
            />
          </Box>
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
                    color: lastBreastfeedingLabel.isInProgress
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
            order: lastBottleFeedingLabel?.isInProgress ? 0 : 2,
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: lastBottleFeedingLabel?.isInProgress
                ? (theme.palette.primary.main as string)
                : "transparent",
              backgroundColor: lastBottleFeedingLabel?.isInProgress
                ? `${theme.palette.primary.main}20`
                : undefined,
              boxShadow: lastBottleFeedingLabel?.isInProgress
                ? `0 0 5px 0px ${theme.palette.primary.main}`
                : undefined,
              borderRadius: 1,
            }}
          >
            <ActivityButton
              activity={bottleFeedingActivity}
              showLabel
              sx={{
                ...activityButtonStyle,
              }}
              onClick={(e) => {
                handleActivityClick({
                  event: e,
                  activity: bottleFeedingActivity,
                  lastEntry: lastBottleFeedingEntry,
                  label: lastBottleFeedingLabel,
                });
              }}
            />
          </Box>
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
                    color: lastBottleFeedingLabel.isInProgress
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
            order: lastDiaperLabel?.isInProgress ? 0 : 3,
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: lastDiaperLabel?.isInProgress
                ? (theme.palette.primary.main as string)
                : "transparent",
              backgroundColor: lastDiaperLabel?.isInProgress
                ? `${theme.palette.primary.main}20`
                : undefined,
              boxShadow: lastDiaperLabel?.isInProgress
                ? `0 0 5px 0px ${theme.palette.primary.main}`
                : undefined,
              borderRadius: 1,
            }}
          >
            <ActivityButton
              activity={diaperActivity}
              showLabel
              sx={{
                ...activityButtonStyle,
              }}
              onClick={(e) => {
                handleActivityClick({
                  event: e,
                  activity: diaperActivity,
                  lastEntry: lastDiaperEntry,
                  label: lastDiaperLabel,
                });
              }}
            />
          </Box>
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
                    color: lastDiaperLabel.isInProgress
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
            order: lastSleepLabel?.isInProgress ? 0 : 4,
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: lastSleepLabel?.isInProgress
                ? (theme.palette.primary.main as string)
                : "transparent",
              backgroundColor: lastSleepLabel?.isInProgress
                ? `${theme.palette.primary.main}20`
                : undefined,
              boxShadow: lastSleepLabel?.isInProgress
                ? `0 0 5px 0px ${theme.palette.primary.main}`
                : undefined,
              borderRadius: 1,
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
                  lastEntry: lastSleepEntry,
                  label: lastSleepLabel,
                });
              }}
            />
          </Box>
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
                    color: lastSleepLabel.isInProgress
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
            order: 9999,
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: "transparent",
              backgroundColor: undefined,
              boxShadow: undefined,
              borderRadius: 1,
              // flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "& button": {
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                "& svg": {
                  fontSize: "3.5em",
                  // opacity: 0.8,
                },
              },
            }}
          >
            <ActivityButton
              Icon={AddIcon}
              activity={null}
              // showLabel
              // overrideLabel="Autre"
              sx={{
                ...activityButtonStyle,
              }}
              onClick={(e) => {
                setActivitiesDrawerIsOpen(true);
              }}
            />
          </Box>
          <Stack
            sx={{
              marginTop: 1,
            }}
          ></Stack>
        </Box> */}
      </Stack>

      {/* <ActivitiesDrawer
        isOpen={activitiesDrawerIsOpen}
        onClose={() => setActivitiesDrawerIsOpen(false)}
        handleActivityClick={(type: ActivityType) =>
          navigate(
            getPath({
              page: PageName.Entry,
              params: { activity: type.toString() },
            })
          )
        }
      /> */}
    </>
  );
}
