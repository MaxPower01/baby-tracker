import { Box } from "@mui/material";
import { PoopColor } from "@/types/PoopColor";
import { PoopColorId } from "@/enums/PoopColorId";
import React from "react";
import { selectPoopColors } from "@/state/activitiesSlice";
import { useSelector } from "react-redux";

type Props = {
  value: PoopColorId | null;
  setValue: React.Dispatch<React.SetStateAction<PoopColorId | null>>;
};

export default function PoopColorPicker(props: Props) {
  const items = useSelector(selectPoopColors);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: 1,
        margin: 0,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: item.value,
            margin: 1,
            cursor: "pointer",
            // border: props.value === item.id ? "2px solid black" : "none",
          }}
          onClick={() => props.setValue(item.id)}
        />
      ))}
    </Box>
  );
}
