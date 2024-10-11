import { Box, Card, Stack, Typography, useTheme } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
  OnDragStartResponder,
} from "react-beautiful-dnd";
import React, { useCallback } from "react";
import {
  saveEntryTypesOrderInDB,
  selectEntryTypesOrder,
} from "@/state/slices/settingsSlice";

import { CustomBottomBar } from "@/components/CustomBottomBar";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import { PageLayout } from "@/components/PageLayout";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPageTitle from "@/utils/getPageTitle";
import getPath from "@/utils/getPath";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "@/components/SnackbarProvider";

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const { showSnackbar } = useSnackbar();

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

  const saveChanges = useCallback(() => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (isSaving || user == null) {
          return resolve(false);
        }
        setIsSaving(true);
        await dispatch(
          saveEntryTypesOrderInDB({
            user: user,
            entryTypesOrder: localEntryTypesOrder,
          })
        ).unwrap();
        setIsSaving(false);
        navigate(
          getPath({
            page: PageId.Home,
          })
        );
        return resolve(true);
      } catch (error) {
        setIsSaving(false);
        showSnackbar({
          id: "save-entry-types-order-error",
          isOpen: true,
          message:
            "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer plus tard.",
          severity: "error",
        });
        return reject(error);
      }
    });
  }, [dispatch, localEntryTypesOrder, isSaving, user, showSnackbar]);

  if (entryTypesOrder.length === 0) {
    return <LoadingIndicator />;
  }

  // react-beautiful-dnd does not support React.StrictMode
  // See issue #2350 for more details: https://github.com/atlassian/react-beautiful-dnd/issues/2350

  return (
    <PageLayout
      topBarProps={{
        pageTitle: getPageTitle(PageId.Activities),
        renderBackButton: true,
      }}
      OverrideBottomBar={() => (
        <CustomBottomBar
          onSaveButtonClick={saveChanges}
          saveButtonDisabled={isSaving}
          saveButtonLoading={isSaving}
        />
      )}
    >
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
                              <EntryTypeIcon
                                type={entryTypeId}
                                sx={{
                                  fontSize: "2em",
                                }}
                              />

                              <Typography
                                variant={"body1"}
                                sx={{
                                  marginLeft: 2,
                                  color: theme.customPalette.text.primary,
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
    </PageLayout>
  );
}
