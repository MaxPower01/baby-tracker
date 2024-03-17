import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextDrawer } from "@/pages/Activity/components/ActivityContextDrawer";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import AddIcon from "@mui/icons-material/Add";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { RootState } from "@/state/store";
import { activityContextTypeCanMultiSelect } from "@/pages/Activity/utils/activityContextTypeCanMultiSelect";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getActivityContextPickerPlaceholder } from "@/pages/Activity/utils/getActivityContextPickerPlaceholder";
import { getActivityContextType } from "@/pages/Activity/utils/getActivityContextType";
import { selectActivityContextsOfType } from "@/state/activitiesSlice";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

type Props = {
  entryType: EntryType;
  selectedItems: ActivityContext[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ActivityContext[]>>;
};

export function ActivityContextPicker(props: Props) {
  const addNewItemId = `add-new-item-${uuid()}`;
  const activityContextType = getActivityContextType(props.entryType);
  const items = useSelector((state: RootState) =>
    selectActivityContextsOfType(state, activityContextType)
  );
  const canMultiSelect = activityContextTypeCanMultiSelect(activityContextType);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const placeholderName =
    getActivityContextPickerPlaceholder(activityContextType);
  const newItemLabel =
    getActivityContextPickerNewItemLabel(activityContextType);
  const theme = useTheme();
  const label = () => {
    return (
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent={"flex-start"}
        alignItems={"center"}
        sx={{
          paddingLeft: "1.5em",
          position: "relative",
        }}
      >
        <ActivityIcon
          type={props.entryType}
          sx={{
            fontSize: "1.5em",
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: theme.opacity.tertiary,
          }}
        />
        <Box
          sx={{
            marginLeft: 1,
            color: theme.customPalette.text.tertiary,
          }}
        >
          {placeholderName}
        </Box>
      </Stack>
    );
  };
  const handleSelectedItemsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    if (value.includes(addNewItemId)) {
      setSelectIsOpen(false);
      setDrawerIsOpen(true);
      return;
    }
    props.setSelectedItems((prev) => {
      return items.filter((item) => value.includes(item.id));
    });
  };
  const [selectIsOpen, setSelectIsOpen] = useState(false);

  const handleOpenSelect = () => {
    // if (canMultiSelect) {
    //   // For now, we'll bypass the Select component and go straight to the drawer
    //   // since it's easier to add new items and confirm the selection
    setDrawerIsOpen(true);
    // } else {
    //   setSelectIsOpen(true);
    // }
  };

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="activity-context-label">{label()}</InputLabel>
        <Select
          id="activity-context"
          multiple={canMultiSelect}
          labelId="activity-context-label"
          value={props.selectedItems.map((item) => item.id)}
          label={label()}
          onChange={handleSelectedItemsChange}
          open={selectIsOpen}
          onOpen={handleOpenSelect}
          onClose={() => setSelectIsOpen(false)}
          renderValue={
            canMultiSelect
              ? (selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const item = props.selectedItems.find(
                        (item) => item.id === value
                      );
                      if (!item) {
                        return null;
                      }
                      return <Chip key={item.id} label={item.name} />;
                    })}
                  </Box>
                )
              : undefined
          }
        >
          {items.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                {canMultiSelect ? (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={props.selectedItems.some(
                          (selectedItem) => selectedItem.id === item.id
                        )}
                        name={item.name}
                      />
                    }
                    label={item.name}
                  />
                ) : (
                  <ListItemText primary={item.name} />
                )}
              </MenuItem>
            );
          })}

          <MenuItem key={addNewItemId} value={addNewItemId}>
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              sx={{
                opacity: theme.opacity.tertiary,
              }}
            >
              <AddIcon />
              <ListItemText primary={newItemLabel} />
            </Stack>
          </MenuItem>
        </Select>
      </FormControl>

      <ActivityContextDrawer
        type={props.entryType}
        isOpen={drawerIsOpen}
        onClose={() => {
          setDrawerIsOpen(false);
          setSelectIsOpen(false);
        }}
        selectedItems={props.selectedItems}
        setSelectedItems={props.setSelectedItems}
        canMultiSelect={canMultiSelect}
      />
    </>
  );
}
