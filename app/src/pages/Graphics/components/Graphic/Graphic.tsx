import { BreastFeedingGraphic } from "@/pages/Graphics/components/Graphic/BreastFeedingGraphic";
import { DefaultGaphic } from "@/pages/Graphics/components/Graphic/DefaultGaphic";
import { DiaperGraphic } from "@/pages/Graphics/components/Graphic/DiaperGraphic";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { PoopGraphic } from "@/pages/Graphics/components/Graphic/PoopGraphic";
import React from "react";
import { SleepGraphic } from "@/pages/Graphics/components/Graphic/SleepGraphic";
import { UrineGraphic } from "@/pages/Graphics/components/Graphic/UrineGraphic";

type Props = {
  timeScale: "hours" | "days";
  entryTypeId: EntryTypeId;
};

export function Graphic(props: Props) {
  switch (props.entryTypeId) {
    case EntryTypeId.Sleep:
      return <SleepGraphic timeScale={props.timeScale} />;
    case EntryTypeId.Diaper:
      return <DiaperGraphic timeScale={props.timeScale} />;
    case EntryTypeId.BreastFeeding:
      return <BreastFeedingGraphic timeScale={props.timeScale} />;
    case EntryTypeId.Poop:
      return <PoopGraphic timeScale={props.timeScale} />;
    case EntryTypeId.Urine:
      return <UrineGraphic timeScale={props.timeScale} />;
    default:
      return (
        <DefaultGaphic
          timeScale={props.timeScale}
          entryTypeId={props.entryTypeId}
        />
      );
  }
}
