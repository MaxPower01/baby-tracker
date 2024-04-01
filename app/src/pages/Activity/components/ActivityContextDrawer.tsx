import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
  OnDragStartResponder,
} from "react-beautiful-dnd";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addActivityContext,
  selectActivityContexts,
  selectActivityContextsOfType,
  setActivityContextsOfType,
  updateActivityContexts,
} from "@/state/slices/activitiesSlice";

import ActivityButtons from "@/pages/Activities/components/ActivityButtons";
import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from "@mui/icons-material/Edit";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import { RootState } from "@/state/store";
import { deviceIsMobile } from "@/utils/deviceIsMobile";
import { getActivityContextDrawerAddItemPlaceholder } from "@/pages/Activity/utils/getActivityContextDrawerAddItemPlaceholder";
import { getActivityContextDrawerTitle } from "@/pages/Activity/utils/getActivityContextDrawerTitle";
import { getActivityContextTypeFromEntryType } from "@/pages/Activity/utils/getActivityContextTypeFromEntryType";
import { getEntryTypeFromActivityContextType } from "@/pages/Activity/utils/getEntryTypeFromActivityContextType";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { useSnackbar } from "@/components/SnackbarProvider";
import { v4 as uuid } from "uuid";

const StyledFab = styled(Fab)({
  zIndex: 0,
});

type Props = {
  type: EntryTypeId;
  isOpen: boolean;
  onClose: () => void;
  selectedItems: ActivityContext[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ActivityContext[]>>;
  canMultiSelect: boolean;
};

export function ActivityContextDrawer(props: Props) {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const [editMode, setEditMode] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const defaultDrawerTitle = getActivityContextDrawerTitle(props.type);
  const editModeDrawerTitle = useMemo(() => {
    // return `${defaultDrawerTitle} (Édition)`;
    return `${defaultDrawerTitle}`;
  }, [defaultDrawerTitle]);
  const drawerTitle = useMemo(() => {
    return editMode ? editModeDrawerTitle : defaultDrawerTitle;
  }, [editMode, defaultDrawerTitle, editModeDrawerTitle]);
  const activityContextType = getActivityContextTypeFromEntryType(props.type);
  const [error, setError] = React.useState<string | null>(null);
  const [newItemName, setNewItemName] = React.useState("");
  const textfieldId = "new-activity-context";
  const errorSnackbarId = `error-${uuid()}`;
  const setFocusOnTextfield = () => {
    const input = document.getElementById(textfieldId);
    if (input) {
      input.click();
      input.focus();
    }
  };
  const removeFocusFromTextfield = () => {
    const input = document.getElementById(textfieldId);
    if (input) {
      input.blur();
    }
  };
  const items = useSelector((state: RootState) =>
    selectActivityContextsOfType(state, activityContextType)
  );
  const [localItems, setLocalItems] = useState(items);
  const confirmButtonLabel = useMemo(() => {
    if (props.selectedItems.length === 0) {
      return "Sélectionner";
    }
    return `Sélectionner (${props.selectedItems.length})`;
  }, [props.selectedItems]);
  const saveChangesButtonLabel = "Sauvegarder";
  const cancelChangesButtonLabel = "Annuler";
  const addItem = useCallback(() => {
    return new Promise<boolean>((resolve, reject) => {
      if (isNullOrWhiteSpace(newItemName)) {
        setNewItemName("");
        setError("Le nom ne peut pas être vide.");
        return reject("Name cannot be empty.");
      }
      if (activityContextType === null) {
        return reject("Activity context type is null.");
      }
      if (!isNullOrWhiteSpace(error)) {
        setError(null);
      }
      const itemNameAlreadyExists = items.some(
        (item) => item.name === newItemName
      );
      if (itemNameAlreadyExists) {
        setError("Un élément avec ce nom existe déjà.");
        return reject("Item with this name already exists.");
      }
      let newItemOrder = 0;
      if (items.length > 0) {
        const firstItem = items[0];
        newItemOrder = firstItem.order - 1;
      }
      // TODO: Save activity context and get id
      const newItem: ActivityContext = {
        id: uuid(),
        name: newItemName,
        order: newItemOrder,
        type: activityContextType,
      };
      setIsSaving(true);
      // Simulating an async call with a timeout
      setTimeout(() => {
        let success = true;
        if (success) {
          setNewItemName("");
          setLocalItems((prev) => {
            return [...prev, newItem].sort((a, b) => a.order - b.order);
          });
          dispatch(
            addActivityContext({
              activityContext: JSON.stringify(newItem),
            })
          );
          if (props.canMultiSelect) {
            props.setSelectedItems((prev) => {
              return [...prev, newItem].sort((a, b) => a.order - b.order);
            });
          } else {
            props.setSelectedItems([newItem]);
          }
        } else {
          showSnackbar({
            id: errorSnackbarId,
            message:
              "Une erreure s'est produite, veuillez réessayer plus tard.",
            severity: "error",
            isOpen: true,
          });
          return reject("An error occurred while saving the item.");
        }
        setIsSaving(false);
        return resolve(success);
      }, 500);
    });
  }, [items, activityContextType, newItemName, error]);

  const handleMultiSelectChange = (id: string) => {
    props.setSelectedItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) {
        const item = items.find((item) => item.id === id);
        if (!item) {
          return prev;
        }
        return [...prev, item];
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSingleSelectChange = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (!item) {
      return;
    }
    props.setSelectedItems([item]);
    handleClose();
  };

  const handleClose = () => {
    removeFocusFromTextfield();
    setNewItemName("");
    setEditMode(false);
    props.onClose();
  };

  if (props.isOpen && items.length === 0) {
    if (!deviceIsMobile()) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          setFocusOnTextfield();
        });
      }, 100);
    }
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  if (activityContextType === null) {
    return null;
  }

  const handleTextfieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newName = event.target.value;
    if ((newName ?? "").trim().length === 0) {
      setError(null);
    }
    setNewItemName(event.target.value);
  };

  const addItemAndConfirmIfNeeded = () => {
    return new Promise<void>((resolve, reject) => {
      addItem()
        .then((success) => {
          if (success) {
            if (items.length > 0 || !props.canMultiSelect) {
              handleClose();
            }
          }
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  };

  const handleEmptyStateClick = () => {
    if (newItemName.trim().length === 0) {
      setFocusOnTextfield();
    } else {
      addItemAndConfirmIfNeeded()
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleTextfieldKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addItemAndConfirmIfNeeded()
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleAddItemButtonClick = () => {
    addItemAndConfirmIfNeeded()
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  const saveChanges = useCallback(() => {
    setIsSaving(true);
    const serializedItems = localItems.map((item) => JSON.stringify(item));
    // Simulating an async call with a timeout
    setTimeout(() => {
      dispatch(
        setActivityContextsOfType({
          activityContexts: serializedItems,
          type: activityContextType,
        })
      );
      props.setSelectedItems((prev) => {
        return prev.map((item) => {
          const updatedItem = localItems.find((i) => i.id === item.id);
          if (updatedItem) {
            return updatedItem;
          }
          return item;
        });
      });
      setIsSaving(false);
      setEditMode(false);
    }, 500);
  }, [items, localItems]);

  const cancelChanges = useCallback(() => {
    setLocalItems(items);
    setEditMode(false);
  }, [items, localItems]);

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
      setLocalItems(newItems);
    },
    [localItems]
  );

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

  const [itemToDelete, setItemToDelete] = useState<ActivityContext | null>(
    null
  );
  const [dialogOpened, setDialogOpened] = useState(false);
  const handleDialogClose = () => {
    setItemToDelete(null);
    setDialogOpened(false);
  };

  const handleDeleteButtonClick = useCallback(
    (item: ActivityContext) => {
      setItemToDelete(item);
      setDialogOpened(true);
    },
    [localItems]
  );

  const deleteItem = useCallback(() => {
    if (itemToDelete === null) {
      return;
    }
    setLocalItems((prevItems) => {
      const newItems = prevItems.filter((i) => i.id !== itemToDelete.id);
      return [...newItems];
    });
    setItemToDelete(null);
    setDialogOpened(false);
  }, [localItems, itemToDelete]);

  const entryTypeForActivityIcon = useMemo(() => {
    return getEntryTypeFromActivityContextType(activityContextType);
  }, [activityContextType]);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={props.isOpen}
        onOpen={() => {}}
        onClose={handleClose}
        disableSwipeToOpen={true}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "inherit",
            backgroundImage: "inherit",
          }}
        >
          <Container maxWidth={CSSBreakpoint.Small} disableGutters>
            <Toolbar>
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                {entryTypeForActivityIcon != null && (
                  <ActivityIcon
                    type={entryTypeForActivityIcon}
                    sx={{
                      flexShrink: 0,
                      fontSize: "1.75em",
                    }}
                  />
                )}
                <Typography variant="h6">{drawerTitle}</Typography>
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                onClick={() => {
                  toggleEditMode();
                }}
                disabled={isSaving || items.length <= 0}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
            <Divider
              sx={{
                marginLeft: 2,
                marginRight: 2,
              }}
            />
          </Container>
        </Box>
        <Container
          maxWidth={CSSBreakpoint.Small}
          sx={{
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: "inherit",
            backgroundImage: "inherit",
          }}
        >
          <Box
            sx={{
              maxHeight: "70vh",
              backgroundColor: "inherit",
              backgroundImage: "inherit",
            }}
          >
            <Stack
              spacing={2}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ width: "100%" }}
              flexGrow={1}
            >
              {!editMode && (
                <FormControl fullWidth variant="outlined">
                  <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <TextField
                      id={textfieldId}
                      placeholder={getActivityContextDrawerAddItemPlaceholder(
                        props.type
                      )}
                      value={newItemName}
                      onChange={handleTextfieldChange}
                      onKeyUp={handleTextfieldKeyUp}
                      error={!isNullOrWhiteSpace(error)}
                      helperText={error}
                      fullWidth
                      disabled={isSaving}
                    />
                    <StyledFab
                      color="primary"
                      size="small"
                      sx={{
                        flexShrink: 0,
                      }}
                      onClick={handleAddItemButtonClick}
                      disabled={isNullOrWhiteSpace(newItemName) || isSaving}
                    >
                      <AddIcon />
                    </StyledFab>
                  </Stack>
                </FormControl>
              )}

              {items.length > 0 && editMode && (
                <DragDropContext
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                >
                  <Droppable droppableId={droppableId}>
                    {(provided, snapshot) => (
                      <Stack
                        justifyContent={"flex-start"}
                        sx={{
                          width: "100%",
                        }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
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
                                          opacity: theme.opacity.tertiary,
                                          flexShrink: 0,
                                        }}
                                      />

                                      <Stack
                                        spacing={0}
                                        direction={"row"}
                                        justifyContent={"flex-start"}
                                        alignItems={"center"}
                                        flexGrow={1}
                                      >
                                        <TextField
                                          value={item.name}
                                          onChange={(event) =>
                                            handleItemNameChange(event, item)
                                          }
                                          fullWidth
                                          size="small"
                                        />
                                      </Stack>
                                      <IconButton
                                        onClick={() =>
                                          handleDeleteButtonClick(item)
                                        }
                                        sx={{
                                          flexShrink: 0,
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
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
              )}

              {items.length > 0 && !editMode && (
                <FormControl fullWidth variant="outlined">
                  <FormGroup
                    sx={{
                      width: "100%",
                      marginTop: 1,
                    }}
                  >
                    {items.map((item) => {
                      return props.canMultiSelect ? (
                        <FormControlLabel
                          key={item.id}
                          control={
                            <Checkbox
                              checked={props.selectedItems.some(
                                (selectedItem) => selectedItem.id === item.id
                              )}
                              onChange={() => handleMultiSelectChange(item.id)}
                              name={item.name}
                            />
                          }
                          label={item.name}
                        />
                      ) : (
                        <MenuItem
                          key={item.id}
                          value={item.id}
                          onClick={() => handleSingleSelectChange(item.id)}
                        >
                          <ListItemText primary={item.name} />
                        </MenuItem>
                      );
                    })}
                  </FormGroup>
                </FormControl>
              )}

              {items.length <= 0 && (
                <EmptyState
                  context={EmptyStateContext.ActivityContextDrawer}
                  activityContextType={activityContextType}
                  onClick={handleEmptyStateClick}
                />
              )}

              {items.length > 0 && props.canMultiSelect && !editMode && (
                <Box
                  sx={{
                    flexShrink: 0,
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "inherit",
                    backgroundImage: "inherit",
                    paddingTop: 1,
                    paddingBottom: 1,
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    fullWidth
                    size="large"
                    disabled={isSaving || !props.selectedItems.length}
                    sx={{
                      height: `calc(${theme.typography.button.fontSize} * 2.5)`,
                    }}
                  >
                    <Typography variant="button">
                      {confirmButtonLabel}
                    </Typography>
                    <Box
                      sx={{
                        display: isSaving ? "flex" : "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LoadingIndicator
                        size={`calc(${theme.typography.button.fontSize} * 2)`}
                      />
                    </Box>
                  </Button>
                </Box>
              )}

              {items.length > 0 && editMode && (
                <Box
                  sx={{
                    flexShrink: 0,
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "inherit",
                    backgroundImage: "inherit",
                    paddingTop: 1,
                    paddingBottom: 1,
                    width: "100%",
                  }}
                >
                  <Stack spacing={1} direction={"row"}>
                    <Button
                      variant="outlined"
                      onClick={cancelChanges}
                      fullWidth
                      size="large"
                      disabled={isSaving}
                      sx={{
                        height: `calc(${theme.typography.button.fontSize} * 2.5)`,
                      }}
                    >
                      <Typography variant="button">
                        {cancelChangesButtonLabel}
                      </Typography>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={saveChanges}
                      fullWidth
                      size="large"
                      disabled={isSaving}
                      sx={{
                        height: `calc(${theme.typography.button.fontSize} * 2.5)`,
                      }}
                    >
                      <Typography variant="button">
                        {saveChangesButtonLabel}
                      </Typography>
                      <Box
                        sx={{
                          display: isSaving ? "flex" : "none",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LoadingIndicator
                          size={`calc(${theme.typography.button.fontSize} * 2)`}
                        />
                      </Box>
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </Container>
      </SwipeableDrawer>

      <Dialog
        open={dialogOpened}
        onClose={handleDialogClose}
        aria-labelledby="delete-activity-context-dialog-title"
        aria-describedby="delete-activity-context-dialog-description"
      >
        <DialogTitle id="delete-activity-context-dialog-title">
          Supprimer un élément
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-activity-context-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet élément?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteItem}
            autoFocus
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
