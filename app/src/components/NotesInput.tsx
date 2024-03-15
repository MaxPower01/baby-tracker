import React from "react";
import { TextField } from "@mui/material";

type Props = {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
};

export function NotesInput(props: Props) {
  return (
    <TextField
      label=""
      name="note"
      type="text"
      placeholder="Des détails supplémentaires, des commentaires, etc."
      value={props.note}
      onChange={(e) => props.setNote(e.target.value)}
      fullWidth
      multiline
      minRows={5}
    />
  );
}
