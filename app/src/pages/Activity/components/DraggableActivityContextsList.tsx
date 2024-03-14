import { Box, Card, Stack, TextField, useTheme } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
  OnDragStartResponder,
} from "react-beautiful-dnd";
import React, { useCallback, useState } from "react";
import {
  selectActivityContextsOfType,
  updateActivityContexts,
} from "@/state/activitiesSlice";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { RootState } from "@/state/store";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useSelector } from "react-redux";

type Props = {
  activityContextType: ActivityContextType;
  // TODO: onSave
};

export function DraggableActivityContextsList(props: Props) {
  const items = useSelector((state: RootState) =>
    selectActivityContextsOfType(state, props.activityContextType)
  );

  const [localItems, setLocalItems] = useState(items);

  const onDragStart: OnDragStartResponder = useCallback((result) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }, []);

  const reorder = (
    list: ActivityContext[],
    startIndex: number,
    endIndex: number
  ) => {
    let result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result = result.map((item, index) => {
      return { ...item, order: index };
    });
    return [...result];
  };

  const onDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const newItems = reorder(
        localItems,
        result.source.index,
        result.destination.index
      );
      setLocalItems((prevItems) => [...newItems]);
    },
    [localItems]
  );

  const theme = useTheme();

  const getDraggableCardStyle = (isDragging: boolean, draggableStyle: any) => ({
    width: "100%",
    ...draggableStyle,
    "& .Item": {
      backgroundColor: isDragging ? theme.palette.action.hover : undefined,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    background: isDragging ? undefined : "transparent",
  });

  const droppableId = "activity-contexts-droppable";

  const handleItemNameChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      item: ActivityContext
    ) => {
      const newName = event.target.value;
      setLocalItems((prevItems) => {
        const newItems = prevItems.map((i) => {
          if (i.id === item.id) {
            return { ...i, name: newName };
          }
          return i;
        });
        return [...newItems];
      });
    },
    [localItems]
  );

  if (localItems.length === 0) {
    return null;
  }

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
            {localItems.map((item, index) => {
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
                      sx={getDraggableCardStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      elevation={0}
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
                            {item.name}
                            <TextField
                              value={item.name}
                              onChange={(event) =>
                                handleItemNameChange(event, item)
                              }
                              fullWidth
                            />
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
