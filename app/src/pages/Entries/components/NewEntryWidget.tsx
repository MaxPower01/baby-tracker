import {
  Box,
  Button,
  Card,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import ActivitiesDrawer from "@/pages/Activities/components/ActivitiesDrawer";
import ActivityButton from "@/pages/Activities/components/ActivityButton";
import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import EntryModel from "@/pages/Entries/models/EntryModel";
import PageId from "@/enums/PageId";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { selectActivities } from "@/pages/Activities/state/activitiesSlice";
import useEntries from "@/pages/Entries/hooks/useEntries";
import useMenu from "@/components/Menu/hooks/useMenu";
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

  const activityButtonWidth = "12em";
  const activityButtonPaddingLeftRight = 2;
  const activityButtonFontSize = "0.7em";
  const boxPadding = 4;
  const activityButtonTypographyFontSize = "1em";

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
    paddingTop: 0.5,
    paddingBottom: 0.5,
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
    textAlign: "center",
  };
  const titleStyle: SxProps = {
    textAlign: "center",
  };

  const textVariant = "caption";
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
                        ? (`${theme.palette.primary.main}50` as string)
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
                <Button
                  key={activity.type}
                  variant="text"
                  onClick={() =>
                    navigate(
                      getPath({
                        page: PageId.Entry,
                        id: lastEntry?.id ?? "",
                      })
                    )
                  }
                  sx={{
                    marginTop: 0,
                    fontSize: activityButtonFontSize,
                    width: `calc(${activityButtonWidth} + 1.6px + ${
                      boxPadding * 2
                    }px)`,
                    paddingLeft: activityButtonPaddingLeftRight,
                    paddingRight: activityButtonPaddingLeftRight,
                    order: isInProgress ? 0 : activity.order + 1,
                    // paddingTop: 0.5,
                  }}
                >
                  <Stack
                    sx={{
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant={textVariant}
                      color={theme.customPalette.text.secondary}
                      sx={{
                        ...subtitleStyle,
                        lineHeight: 1.4,
                        textTransform: "none",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lastEntryLabels.subtitle}
                    </Typography>
                    <Typography
                      variant={textVariant}
                      color={
                        isInProgress
                          ? theme.palette.primary.main
                          : theme.customPalette.text.primary
                      }
                      sx={{
                        ...titleStyle,
                        fontWeight: isInProgress ? "bold" : undefined,
                        textTransform: "none",
                        lineHeight: 1.4,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lastEntryLabels.title}
                    </Typography>
                  </Stack>
                </Button>
              );
            }
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
