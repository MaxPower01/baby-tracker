import { BreastFeedingChart } from "@/pages/Charts/components/BreastFeedingChart";
import { DefaultChart } from "@/pages/Charts/components/DefaultChart";
import { DiaperChart } from "@/pages/Charts/components/DiaperChart";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { PoopChart } from "@/pages/Charts/components/PoopChart";
import React from "react";
import { SleepChart } from "@/pages/Charts/components/SleepChart";
import { UrineChart } from "@/pages/Charts/components/UrineChart";

type Props = {
  timeScale: "hours" | "days";
  entryTypeId: EntryTypeId;
};

export function Chart(props: Props) {
  switch (props.entryTypeId) {
    case EntryTypeId.Sleep:
      return <SleepChart timeScale={props.timeScale} />;
    case EntryTypeId.Diaper:
      return <DiaperChart timeScale={props.timeScale} />;
    case EntryTypeId.BreastFeeding:
      return <BreastFeedingChart timeScale={props.timeScale} />;
    case EntryTypeId.Poop:
      return <PoopChart timeScale={props.timeScale} />;
    case EntryTypeId.Urine:
      return <UrineChart timeScale={props.timeScale} />;
    default:
      return (
        <DefaultChart
          timeScale={props.timeScale}
          entryTypeId={props.entryTypeId}
        />
      );
  }
}
