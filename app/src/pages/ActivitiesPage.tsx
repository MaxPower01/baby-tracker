import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
  OnDragStartResponder,
} from "react-beautiful-dnd";
import {
  selectActivities,
  updateActivitiesOrder,
} from "@/modules/activities/state/activitiesSlice";

import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import LoadingIndicator from "@/common/components/LoadingIndicator";
import React from "react";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import { useSelector } from "react-redux";

export default function ActivitiesPage() {
  const initialActivities = useSelector(selectActivities);

  const [activities, setActivities] = React.useState(initialActivities);

  const dispatch = useAppDispatch();

  const reorder = (
    list: ActivityModel[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const droppableId = "activities";

  const onDragStart: OnDragStartResponder = (result) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }
    const newActivities = reorder(
      activities,
      result.source.index,
      result.destination.index
    );
    setActivities(newActivities);
    const newActivitiesOrder = newActivities.map((activity) => activity.type);
    setTimeout(() => {
      dispatch(
        updateActivitiesOrder({
          activitiesOrder: newActivitiesOrder,
        })
      );
    }, 500);
  };

  const theme = useTheme();

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    width: "100%",
    ...draggableStyle,
    "& .Item": {
      backgroundColor: isDragging ? theme.palette.action.hover : undefined,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  });

  if (activities.length === 0) {
    return <LoadingIndicator />;
  }

  // react-beautiful-dnd does not support React.StrictMode
  // See issue #2350 for more details: https://github.com/atlassian/react-beautiful-dnd/issues/2350

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <Stack
            justifyContent={"flex-start"}
            sx={{
              width: "100%",
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
            spacing={1}
          >
            {activities.map((activity, index) => {
              return (
                <Draggable
                  key={index}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Box className="Item">
                        <Stack
                          justifyContent={"flex-start"}
                          alignItems={"center"}
                          direction={"row"}
                          sx={{
                            width: "100%",
                            padding: 1,
                          }}
                          spacing={2}
                        >
                          <DragHandleIcon
                            sx={{
                              opacity: 0.5,
                            }}
                          />
                          <Stack
                            spacing={0}
                            direction={"row"}
                            justifyContent={"flex-start"}
                            alignItems={"center"}
                          >
                            <ActivityIcon
                              activity={activity}
                              sx={{
                                fontSize: "2em",
                              }}
                            />

                            <Typography
                              variant={"body1"}
                              sx={{
                                marginLeft: 2,
                              }}
                            >
                              {activity.name}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Card>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
}
