import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  useTheme,
} from "@mui/material";
import React, { useCallback } from "react";
import {
  selectEntryTypesInFiltersState,
  selectSortOrderInFiltersState,
  selectTimePeriodInFiltersState,
  setTimePeriodInFiltersState,
} from "@/state/slices/filtersSlice";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { getTimePeriodPickerItems } from "@/utils/getTimePeriodPickerItems";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useSelector } from "react-redux";

type Props = {
  sx?: SxProps;
};

export function TimePeriodPicker(props: Props) {
  const items = getTimePeriodPickerItems();
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const timePeriod = useSelector(selectTimePeriodInFiltersState);
  const entryTypes = useSelector(selectEntryTypesInFiltersState);
  const sortOrder = useSelector(selectSortOrderInFiltersState);

  const handleChange = useCallback(
    (event: SelectChangeEvent<TimePeriodId>) => {
      dispatch(
        setTimePeriodInFiltersState({
          timePeriod: event.target.value as TimePeriodId,
        })
      );
    },
    [dispatch, entryTypes, sortOrder]
  );

  const renderValue = (selected: TimePeriodId | null) => {
    if (selected === null) {
      return "";
    }
    const item = items.find((item) => item.id == selected);
    if (item === undefined) {
      return "";
    }
    return (
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <CalendarTodayIcon
          sx={{
            color: theme.palette.action.active,
          }}
        />
        <ListItemText primary={item.label} />
      </Stack>
    );
  };

  if (!items.length) {
    return null;
  }

  return (
    <Box
      sx={{
        ...props.sx,
      }}
    >
      <FormControl fullWidth variant="outlined">
        <Select
          id="search-range-picker"
          labelId="search-range-picker-label"
          value={timePeriod ?? ""}
          onChange={handleChange}
          renderValue={renderValue}
        >
          {items.map((item) => {
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: item.divider
                    ? theme.palette.divider
                    : "transparent",
                }}
              >
                <ListItemText primary={item.label} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
