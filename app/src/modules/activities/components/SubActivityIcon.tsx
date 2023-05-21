import SubActivityType from "@/modules/activities/enums/SubActivityType";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import { Box, SxProps } from "@mui/material";
import { ReactSVG } from "react-svg";

function MeconiumIcon() {
  return <ReactSVG src="icons/poop.svg" className="ActivityIcon" />;
}

function SleepIcon() {
  return <ReactSVG src="/icons/sleep.svg" className="ActivityIcon" />;
}

type Props = {
  subActivity: SubActivityModel;
  sx?: SxProps | undefined;
};

export default function ActivityIcon({ subActivity, sx }: Props) {
  return (
    <Box sx={sx}>
      {(() => {
        switch (subActivity.type) {
          case SubActivityType.Meconium:
            return <MeconiumIcon />;
          case SubActivityType.Cradle:
          case SubActivityType.Crib:
          case SubActivityType.Bed:
            return <SleepIcon />;
          default:
            return null;
        }
      })()}
    </Box>
  );
}
