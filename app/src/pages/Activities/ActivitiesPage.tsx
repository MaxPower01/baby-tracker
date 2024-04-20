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
import React, { useCallback, useEffect } from "react";
import {
  saveEntryTypesOrderInState,
  selectEntryTypesOrder,
} from "@/state/slices/settingsSlice";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { CustomBottomBar } from "@/components/CustomBottomBar";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { selectActivities } from "@/state/slices/activitiesSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useLayout } from "@/components/LayoutProvider";
import { useSelector } from "react-redux";

export default function ActivitiesPage() {
  // const initialActivities = useSelector(selectActivities);
  // const [activities, setActivities] = React.useState(initialActivities);

  const layout = useLayout();
  useEffect(() => {
    layout.setBottomBarVisibility("hidden");
    return () => {
      layout.setBottomBarVisibility("visible");
    };
  }, []);

  const entryTypesOrder = useSelector(selectEntryTypesOrder);
  const [localEntryTypesOrder, setLocalEntryTypesOrder] =
    React.useState(entryTypesOrder);
  const [isSaving, setIsSaving] = React.useState(false);

  const dispatch = useAppDispatch();

  const reorder = (
    list: EntryTypeId[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const droppableId = "activities-droppable";

  const onDragStart: OnDragStartResponder = (result) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }
    const newEntryTypesOrder = reorder(
      localEntryTypesOrder,
      result.source.index,
      result.destination.index
    );
    setLocalEntryTypesOrder(newEntryTypesOrder);
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

  const cancelChanges = useCallback(() => {
    setLocalEntryTypesOrder(entryTypesOrder);
  }, [entryTypesOrder, setLocalEntryTypesOrder]);

  const saveChanges = useCallback(() => {
    setIsSaving(true);
    // dispatch(updateEntryTypesOrder({ entryTypesOrder: localEntryTypesOrder }))
    //   .unwrap()
    //   .then(() => {
    //     setIsSaving(false);
    //   });
  }, [dispatch, localEntryTypesOrder]);

  if (entryTypesOrder.length === 0) {
    return <LoadingIndicator />;
  }

  // react-beautiful-dnd does not support React.StrictMode
  // See issue #2350 for more details: https://github.com/atlassian/react-beautiful-dnd/issues/2350

  return (
    <>
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
              {localEntryTypesOrder.map((entryTypeId, index) => {
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
                                type={entryTypeId}
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
                                {getEntryTypeName(entryTypeId)}
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

      <CustomBottomBar
        onSaveButtonClick={() => {}}
        saveButtonDisabled={isSaving}
      />
    </>
  );
}
