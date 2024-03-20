import { Box, Chip, Stack, useTheme } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { PoopColor } from "@/types/PoopColor";
import { PoopColorId } from "@/enums/PoopColorId";
import React from "react";
import { selectPoopColors } from "@/state/slices/activitiesSlice";
import { useSelector } from "react-redux";

type Props = {
  value: PoopColorId | null;
  setValue: React.Dispatch<React.SetStateAction<PoopColorId | null>>;
};

export default function PoopColorPicker(props: Props) {
  const items = useSelector(selectPoopColors);
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={1}
      sx={{
        flexWrap: "wrap",
      }}
    >
      {items.map((item) => {
        console.log(item);
        console.log(props.value);
        return (
          <Chip
            // Icon should be a cirle with the color of the poop
            variant={props.value == item.id ? "filled" : "outlined"}
            icon={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: item.value,
                }}
              />
            }
            label={item.label}
            onClick={() =>
              props.setValue((prev) => (prev == item.id ? null : item.id))
            }
            deleteIcon={props.value == item.id ? <CheckIcon /> : undefined}
            sx={{
              "& .MuiChip-label": {
                color:
                  props.value == item.id
                    ? theme.customPalette.text.primary
                    : theme.customPalette.text.tertiary,
              },
            }}
            //  onDelete={data.label === 'React' ? undefined : handleDelete(data)}
          />
        );
      })}
    </Stack>
  );
}
