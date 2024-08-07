import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";

type Props = {
  timeScale: "hours" | "days";
  entryTypeId: EntryTypeId;
};

export function DefaultChart(props: Props) {
  return <div>DefaultGaphic</div>;
}
