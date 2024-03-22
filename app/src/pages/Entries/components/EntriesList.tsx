import { Entry } from "@/pages/Entry/types/Entry";
import React from "react";
import { Stack } from "@mui/material";

type Props = {
  entries: Entry[];
  dateHeaders?: boolean;
};

export default function EntriesList(props: Props) {
  if (props.entries.length === 0) {
    return <div>EntriesList: No entries</div>;
  }
  return (
    <Stack>
      {props.entries.map((entry, index) => {
        return <div key={index}>Entry: {entry.id}</div>;
      })}
    </Stack>
  );
}
