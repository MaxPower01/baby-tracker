import { Box, SxProps } from "@mui/material";

import { ReactSVG } from "react-svg";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import SubActivityType from "@/modules/activities/enums/SubActivityType";

function MeconiumIcon() {
  return <ReactSVG src="icons/poop.svg" className="ActivityIcon" />;
}

function SleepIcon() {
  return <ReactSVG src="/icons/sleep.svg" className="ActivityIcon" />;
}

function BottleFeedingIcon() {
  return <ReactSVG src="/icons/bottle-feeding.svg" className="ActivityIcon" />;
}

function NasalHygieneIcon() {
  return <ReactSVG src="/icons/nasal-hygiene.svg" className="ActivityIcon" />;
}

function PlayIcon() {
  return <ReactSVG src="/icons/play.svg" className="ActivityIcon" />;
}

function CradleIcon() {
  return <ReactSVG src="/icons/030-baby-crib.svg" className="ActivityIcon" />;
}

function CribIcon() {
  return <ReactSVG src="/icons/bassinet.svg" className="ActivityIcon" />;
}

function BedIcon() {
  return <ReactSVG src="/icons/032-bed.svg" className="ActivityIcon" />;
}

function SwingIcon() {
  return <ReactSVG src="/icons/029-swing.svg" className="ActivityIcon" />;
}

function MoiseIcon() {
  return <ReactSVG src="/icons/moise.svg" className="ActivityIcon" />;
}

function PlayMatIcon() {
  return <ReactSVG src="/icons/031-mat.svg" className="ActivityIcon" />;
}

function PoolIcon() {
  return (
    <ReactSVG src="/icons/037-swimming-pool.svg" className="ActivityIcon" />
  );
}

function BeachIcon() {
  return (
    <ReactSVG src="/icons/038-beach-umbrella.svg" className="ActivityIcon" />
  );
}

function CarSeatIcon() {
  return <ReactSVG src="/icons/car-seat.svg" className="ActivityIcon" />;
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
            return <CradleIcon />;
          case SubActivityType.Crib:
            return <CribIcon />;
          case SubActivityType.Bed:
            return <BedIcon />;
          case SubActivityType.Swing:
            return <SwingIcon />;
          case SubActivityType.Moise:
            return <MoiseIcon />;
          case SubActivityType.FormulaMilk:
          case SubActivityType.BreastMilk:
          case SubActivityType.AdaptedCowMilk:
          case SubActivityType.GoatMilk:
            return <BottleFeedingIcon />;
          case SubActivityType.NasalAspirator:
          case SubActivityType.SalineSolution:
            return <NasalHygieneIcon />;
          case SubActivityType.PlayMat:
            return <PlayMatIcon />;
          case SubActivityType.Pool:
            return <PoolIcon />;
          case SubActivityType.Beach:
            return <BeachIcon />;
          case SubActivityType.CarSeat:
            return <CarSeatIcon />;
          default:
            return null;
        }
      })()}
    </Box>
  );
}
