import React from "react";
import { Stack } from "@mui/material";
import { VolumeInput } from "@/components/VolumeInput";

type Props = {
  hasSides?: boolean;
  leftValue: number;
  setLeftValue: React.Dispatch<React.SetStateAction<number>>;
  rightValue: number;
  setRightValue: React.Dispatch<React.SetStateAction<number>>;
};

export default function VolumeInputContainer(props: Props) {
  return (
    <Stack
      spacing={1}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100%",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-around"}
        alignItems={"center"}
        spacing={8}
        sx={{
          width: "100%",
        }}
      >
        <VolumeInput
          label={props.hasSides ? "Gauche" : undefined}
          value={props.leftValue}
          setValue={props.setLeftValue}
          layout={props.hasSides ? "column" : "row"}
          align="left"
        />

        {props.hasSides && (
          <VolumeInput
            label={"Droite"}
            value={props.rightValue}
            setValue={props.setRightValue}
            layout={"column"}
            align="right"
          />
        )}
      </Stack>
    </Stack>
  );
}
