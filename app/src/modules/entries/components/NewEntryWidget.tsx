import {
  Box,
  Card,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import { formatStopwatchTime, isNullOrWhiteSpace } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";

import ActivitiesDrawer from "@/modules/activities/components/ActivitiesDrawer";
import ActivityButton from "@/modules/activities/components/ActivityButton";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import ActivityType from "@/modules/activities/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import EntryModel from "@/modules/entries/models/EntryModel";
import PageId from "@/common/enums/PageId";
import getPath from "@/utils/getPath";
import { selectActivities } from "@/modules/activities/state/activitiesSlice";
import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
import useEntries from "@/modules/entries/hooks/useEntries";
import useMenu from "@/modules/menu/hooks/useMenu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
  const useCompactMode = useSelector(selectUseCompactMode);
  const { Menu, openMenu, closeMenu } = useMenu();
  const theme = useTheme();
  const [now, setNow] = useState(new Date());
  const activities = useSelector(selectActivities);
  const allActivitiesWithLastEntry = useMemo(() => {
    const _activities = activities.filter((activity) => activity != null);

    return _activities.map((activity) => {
      const activityEntries = entries?.filter((entry: EntryModel) => {
        if (entry == null || entry.activity == null) return false;
        let isActivity = false;
        if (entry.activity.type == activity.type) {
          isActivity = true;
        }
        if (!isActivity && entry.linkedActivities != null) {
          isActivity = entry.linkedActivities.some(
            (linkedActivity) => linkedActivity.type == activity.type
          );
        }
        return isActivity;
      });
      const lastActivityEntry = activityEntries?.[0] ?? null;
      const isInProgress = lastActivityEntry?.anyStopwatchIsRunning ?? false;
      const isLinkedActivity =
        lastActivityEntry?.activity?.type != activity.type;
      const lastEntryLabels = {
        title: activity.getLastEntryTitle({
          lastEntry: lastActivityEntry,
          now,
          lastEntryIsLinkedActivity: isLinkedActivity,
        }),
        subtitle: activity.getLastEntrySubtitle({
          lastEntry: lastActivityEntry,
          now,
          lastEntryIsLinkedActivity: isLinkedActivity,
        }),
      };
      return {
        activity,
        isInProgress,
        lastEntry: lastActivityEntry,
        lastEntryLabels,
      };
    });
  }, [entries, now, activities]);

  const activityButtonWidth = useCompactMode ? "12em" : "11em";
  const activityButtonPaddingLeftRight = 2;
  const activityButtonFontSize = useCompactMode ? "0.7em" : undefined;
  const boxPadding = 4;
  const activityButtonTypographyFontSize = useCompactMode ? "1em" : undefined;

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
    padding: `${boxPadding}px`,
  };
  const activityButtonStyle: SxProps = {
    paddingTop: useCompactMode ? 0.5 : 1,
    paddingBottom: useCompactMode ? 0.5 : 1,
    paddingLeft: activityButtonPaddingLeftRight,
    paddingRight: activityButtonPaddingLeftRight,
    // width: "100%",
    // flex: 1,
    width: activityButtonWidth,
    // backgroundColor: theme.customPalette.background?.almostTransparent,
    border: "1px solid",
    borderColor: "transparent",
    flexGrow: 1,
    height: "100%",
    fontSize: activityButtonFontSize,
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

  const textVariant = useCompactMode ? "caption" : "body2";
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
            page: PageId.Entry,
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
        page: PageId.Entry,
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
    <Stack
      sx={{
        width: "100%",
      }}
    >
      {/* <Typography
        variant={"body1"}
        color={"text.secondary"}
        gutterBottom
        sx={{
          textAlign: "center",
          opacity: 0.8,
          // fontStyle: "italic",
        }}
      >
        Ajouter une entrée
      </Typography> */}
      <Box
        sx={{
          width: "100%",
          overflowX: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "& .ActivityButton__Typography": {
            fontSize: activityButtonTypographyFontSize,
          },
        }}
      >
        <Stack
          // spacing={2}
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
          sx={{
            // paddingTop: 0.5,
            // paddingBottom: 0.5,
            "& .ActivityIcon": {
              fontSize: "4em",
            },
            display: "grid",
            gap: 0.5,
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
                    order: isInProgress ? 0 : activity.order + 1,
                  }}
                >
                  <Card
                    sx={{
                      border: "1px solid",
                      borderColor: isInProgress
                        ? (theme.palette.primary.main as string)
                        : "transparent",
                      backgroundColor: isInProgress
                        ? `${theme.palette.primary.main}30`
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
                  </Card>
                </Box>
              );
            }
          )}
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
          sx={{
            // paddingTop: 0.5,
            // paddingBottom: 0.5,
            "& .ActivityIcon": {
              fontSize: "4em",
            },
            width: "100%",
            display: "grid",
            gap: 0.5,
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
                    marginTop: useCompactMode ? 0 : 0.5,
                    fontSize: useCompactMode
                      ? activityButtonFontSize
                      : theme.typography.button.fontSize,
                    width: `calc(${activityButtonWidth} + 1.6px + ${
                      boxPadding * 2
                    }px)`,
                    paddingLeft: activityButtonPaddingLeftRight,
                    paddingRight: activityButtonPaddingLeftRight,
                    order: isInProgress ? 0 : activity.order + 1,
                  }}
                >
                  <Typography
                    variant={textVariant}
                    color={"text.secondary"}
                    sx={{
                      ...subtitleStyle,
                      // lineHeight: 1.2,
                      // whiteSpace: "pre",
                    }}
                  >
                    {lastEntryLabels.subtitle}
                  </Typography>
                  <Typography
                    variant={textVariant}
                    sx={{
                      ...titleStyle,
                      color: isInProgress
                        ? theme.palette.primary.main
                        : undefined,
                      fontWeight: isInProgress ? "bold" : undefined,
                      // whiteSpace: "pre",
                      // lineHeight: 1,
                    }}
                  >
                    {lastEntryLabels.title}
                  </Typography>
                </Stack>
              );
            }
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
