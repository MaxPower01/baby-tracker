import { Entry } from "@/pages/Entry/types/Entry";
import React from "react";

type Props = {
  entries: Entry[];
  dateHeaders?: boolean;
};

export default function EntriesList(props: Props) {
  if (props.entries.length === 0) {
    return <div>EntriesList: No entries</div>;
  }
  return <div>EntriesList</div>;
}
