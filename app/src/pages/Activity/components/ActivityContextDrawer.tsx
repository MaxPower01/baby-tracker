import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
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
import { OnDragEndResponder, OnDragStartResponder } from "react-beautiful-dnd";
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
  updateActivityContexts,
} from "@/state/activitiesSlice";

import ActivityButtons from "@/pages/Activities/components/ActivityButtons";
import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import { DraggableActivityContextsList } from "./DraggableActivityContextsList";
import EditIcon from "@mui/icons-material/Edit";
import { EmptyState } from "@/components/EmptyState";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import { RootState } from "@/state/store";
import { deviceIsMobile } from "@/utils/deviceIsMobile";
import { getActivityContextDrawerAddItemPlaceholder } from "@/pages/Activity/utils/getActivityContextDrawerAddItemPlaceholder";
import { getActivityContextDrawerTitle } from "@/pages/Activity/utils/getActivityContextDrawerTitle";
import { getActivityContextTypeFromEntryType } from "@/pages/Activity/utils/getActivityContextTypeFromEntryType";
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
  type: EntryType;
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
  const drawerTitle = getActivityContextDrawerTitle(props.type);
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
  const confirmButtonLabel = useMemo(() => {
    if (props.selectedItems.length === 0) {
      return "Sélectionner";
    }
    return `Sélectionner (${props.selectedItems.length})`;
  }, [props.selectedItems]);
  const saveChangesButtonLabel = "Confirmer";
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
      let success = true;
      setTimeout(() => {
        // TODO: Add in Redux
        if (success) {
          setNewItemName("");
        } else {
          return reject("An error occurred while saving the item.");
        }
        dispatch(
          addActivityContext({
            activityContext: JSON.stringify(newItem),
          })
        );
        if (success) {
          if (props.canMultiSelect) {
            props.setSelectedItems((prev) => {
              return [...prev, newItem];
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

  const saveEditModeChanges = () => {
    setEditMode(false);
  };

  return (
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
              <ActivityIcon
                type={props.type}
                sx={{
                  flexShrink: 0,
                  fontSize: "1.75em",
                }}
              />
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
              <DraggableActivityContextsList
                activityContextType={activityContextType}
              />
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

            {items.length > 0 && props.canMultiSelect && (
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
                  <Typography variant="button">{confirmButtonLabel}</Typography>
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
                <Button
                  variant="contained"
                  onClick={saveEditModeChanges}
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
              </Box>
            )}
          </Stack>
        </Box>
      </Container>
    </SwipeableDrawer>
  );
}
