import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
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
  useTheme,
} from "@mui/material";
import React, { useCallback, useMemo } from "react";

import ActivityButtons from "@/pages/Activities/components/ActivityButtons";
import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { EmptyState } from "@/components/EmptyState";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import { getActivityContextDrawerAddItemPlaceholder } from "@/pages/Activity/utils/getActivityContextDrawerAddItemPlaceholder";
import { getActivityContextDrawerTitle } from "@/pages/Activity/utils/getActivityContextDrawerTitle";
import { getActivityContextTypeFromEntryType } from "@/pages/Activity/utils/getActivityContextTypeFromEntryType";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { v4 as uuid } from "uuid";

type Props = {
  type: EntryType;
  isOpen: boolean;
  onClose: () => void;
  activityContextId: string | null;
  setActivityContextId: React.Dispatch<React.SetStateAction<string | null>>;
};

type Item = ActivityContext & { isSelected: boolean };

export function ActivityContextDrawer(props: Props) {
  const theme = useTheme();
  const [editMode, setEditMode] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const drawerTitle = getActivityContextDrawerTitle(props.type);
  const activityContextType = getActivityContextTypeFromEntryType(props.type);
  const [error, setError] = React.useState<string | null>(null);
  const [newItemName, setNewItemName] = React.useState("");
  const textfieldId = "new-activity-context";
  const focusTextfield = () => {
    const input = document.getElementById(textfieldId);
    if (input) {
      input.click();
      input.focus();
    }
  };
  // TODO: fetch activity contexts
  const [items, setItems] = React.useState<Item[]>([]);
  const selectedItems = useMemo(() => {
    return items.filter((item) => item.isSelected);
  }, [items]);
  const confirmButtonLabel = useMemo(() => {
    if (selectedItems.length === 0) {
      return "Sélectionner";
    }
    return `Sélectionner (${selectedItems.length})`;
  }, [selectedItems]);
  const anyItems = items.length > 0;
  const addItem = useCallback(() => {
    if (isNullOrWhiteSpace(newItemName)) {
      setNewItemName("");
      return;
    }
    if (activityContextType === null) {
      return;
    }
    if (!isNullOrWhiteSpace(error)) {
      setError(null);
    }
    const itemNameAlreadyExists = items.some(
      (item) => item.name === newItemName
    );
    if (itemNameAlreadyExists) {
      setError("Un élément avec ce nom existe déjà.");
      return;
    }
    const length = items.length;
    let newItemOrder = 0;
    const lastItem = items.find((item) => item.order === length - 1);
    if (lastItem) {
      newItemOrder = lastItem.order + 1;
    }
    // TODO: Save activity context and get id
    setIsSaving(true);
    setTimeout(() => {
      // Simulating an async call
      const newItemId = uuid();
      setItems((prev) =>
        [
          ...prev,
          {
            id: newItemId,
            type: activityContextType,
            name: newItemName,
            order: newItemOrder,
            isSelected: true,
            createdAtTimestamp: Date.now(),
          },
        ].toSorted((a, b) => b.order - a.order)
      );
      props.setActivityContextId(newItemId);
      const success = true;
      if (success) {
        setNewItemName("");
      } else {
      }
      setIsSaving(false);
    }, 500);
  }, [items, activityContextType, newItemName, error]);

  const handleItemSelection = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, isSelected: !item.isSelected };
        }
        return item;
      })
    );
  };

  const handleConfirm = () => {
    // TODO: Pass selected items to parent component
    props.onClose();
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  if (activityContextType === null) {
    return null;
  }
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={props.isOpen}
      onOpen={() => {}}
      onClose={() => props.onClose()}
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
                // TODO: Set edit mode to true
                toggleEditMode();
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => props.onClose()}>
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
                  onChange={(event) => setNewItemName(event.target.value)}
                  onKeyUp={(event) => {
                    if (event.key === "Enter") {
                      addItem();
                    }
                  }}
                  error={!isNullOrWhiteSpace(error)}
                  helperText={error}
                  fullWidth
                  disabled={isSaving}
                />
                <IconButton
                  color="primary"
                  disabled={isNullOrWhiteSpace(newItemName) || isSaving}
                  onClick={addItem}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <FormGroup
                sx={{
                  width: "100%",
                  marginTop: 2,
                }}
              >
                {items.map((item) => {
                  return (
                    <FormControlLabel
                      key={item.id}
                      control={
                        <Checkbox
                          checked={item.isSelected}
                          onChange={() => handleItemSelection(item.id)}
                          name={item.name}
                        />
                      }
                      label={item.name}
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          </Stack>

          {!anyItems && (
            <div onClick={focusTextfield}>
              <EmptyState />
            </div>
          )}

          {anyItems && (
            <Box
              sx={{
                flexShrink: 0,
                position: "sticky",
                bottom: 0,
                backgroundColor: "inherit",
                backgroundImage: "inherit",
                paddingTop: 1,
                paddingBottom: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={handleConfirm}
                fullWidth
                size="large"
                disabled={
                  isSaving ||
                  isNullOrWhiteSpace(props.activityContextId) ||
                  !selectedItems.length
                }
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
        </Box>
      </Container>
    </SwipeableDrawer>
  );
}
