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
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import {
  getActivityContextPickerPlaceholder,
  getActivityContextType,
} from "@/pages/Activity/utils/getActivityContextPickerPlaceholder";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextDrawer } from "@/pages/Activity/components/ActivityContextDrawer";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { selectActivityContexts } from "@/state/activitiesSlice";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

type Props = {
  entryType: EntryType;
  selectedItems: ActivityContext[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ActivityContext[]>>;
};

export function ActivityContextPicker(props: Props) {
  const addNewItemId = `add-new-item-${uuid()}`;
  const items = useSelector(selectActivityContexts);
  const activityContextType = getActivityContextType(props.entryType);
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

  return (
    <>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="activity-context-label">{label()}</InputLabel>
        <Select
          id="activity-context"
          multiple
          labelId="activity-context-label"
          value={props.selectedItems.map((item) => item.id)}
          label={label()}
          onChange={handleSelectedItemsChange}
          open={selectIsOpen}
          onOpen={() => setSelectIsOpen(true)}
          onClose={() => setSelectIsOpen(false)}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => {
                const item = items.find((item) => item.id === value);
                if (!item) {
                  return null;
                }
                return <Chip key={item.id} label={item.name} />;
              })}
            </Box>
          )}
          // error={sexError !== ""}
        >
          {items.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
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
              </MenuItem>
            );
          })}

          <MenuItem key={addNewItemId} value={addNewItemId}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <AddIcon />
              <ListItemText primary={newItemLabel} />
            </Stack>
          </MenuItem>
        </Select>
      </FormControl>

      <ActivityContextDrawer
        type={props.entryType}
        isOpen={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
        selectedItems={props.selectedItems}
        setSelectedItems={props.setSelectedItems}
      />
    </>
  );
}
