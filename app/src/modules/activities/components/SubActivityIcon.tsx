import SubActivityType from "@/modules/activities/enums/SubActivityType";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import { Box, SxProps } from "@mui/material";
import { ReactSVG } from "react-svg";

function MeconiumIcon() {
  return <ReactSVG src="/poop.svg" className="ActivityIcon" />;
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
          default:
            return null;
        }
      })()}
    </Box>
  );
}
