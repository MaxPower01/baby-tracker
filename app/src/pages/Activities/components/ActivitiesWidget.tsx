import { Entry } from "@/pages/Entry/types/Entry";
import React from "react";

type Props = {
  entries: Entry[];
};

export default function ActivitiesWidget(props: Props) {
  if (props.entries.length === 0) {
    return <div>ActivitiesWidget: No entries</div>;
  }
  return <div>RecentEntriesWidget</div>;
}
