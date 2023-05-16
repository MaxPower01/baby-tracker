import ActivityType from "@/modules/activities/enums/ActivityType";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import { Box, SxProps } from "@mui/material";
import { ReactSVG } from "react-svg";

function BathIcon() {
  return <ReactSVG src="/icons/bath.svg" className="ActivityIcon" />;
}

function BottleFeedingIcon() {
  return <ReactSVG src="/icons/bottle-feeding.svg" className="ActivityIcon" />;
}

function BreastFeedingIcon() {
  return <ReactSVG src="/icons/breast-feeding.svg" className="ActivityIcon" />;
}

function BurpIcon() {
  return <ReactSVG src="/icons/burp.svg" className="ActivityIcon" />;
}

function CarRideIcon() {
  return <ReactSVG src="/icons/car.svg" className="ActivityIcon" />;
}

function CryIcon() {
  return <ReactSVG src="/icons/cry.svg" className="ActivityIcon" />;
}

function DiaperIcon() {
  return <ReactSVG src="/icons/diaper.svg" className="ActivityIcon" />;
}

function HiccupsIcon() {
  return <ReactSVG src="/icons/burp.svg" className="ActivityIcon" />;
}

function HospitalVisitIcon() {
  return <ReactSVG src="/icons/hospital-visit.svg" className="ActivityIcon" />;
}

function MedicineIcon() {
  return <ReactSVG src="/icons/medicine.svg" className="ActivityIcon" />;
}

function MilkExtractionIcon() {
  return <ReactSVG src="/icons/milk-extraction.svg" className="ActivityIcon" />;
}

function NailCuttingIcon() {
  return <ReactSVG src="/icons/nail-clipper.svg" className="ActivityIcon" />;
}

function NasalHygieneIcon() {
  return <ReactSVG src="/icons/nasal-hygiene.svg" className="ActivityIcon" />;
}

function PlayIcon() {
  return <ReactSVG src="/icons/play.svg" className="ActivityIcon" />;
}

function PoopIcon() {
  return <ReactSVG src="/icons/poop.svg" className="ActivityIcon" />;
}

function SizeIcon() {
  return <ReactSVG src="/icons/size.svg" className="ActivityIcon" />;
}

function SleepIcon() {
  return <ReactSVG src="/icons/sleep.svg" className="ActivityIcon" />;
}

function SolidFoodIcon() {
  return <ReactSVG src="/icons/solid-food.svg" className="ActivityIcon" />;
}

function RegurgitationIcon() {
  return <ReactSVG src="/icons/regurgitation.svg" className="ActivityIcon" />;
}

function TemperatureIcon() {
  return <ReactSVG src="/icons/temperature.svg" className="ActivityIcon" />;
}

function TeethIcon() {
  return <ReactSVG src="/icons/teeth.svg" className="ActivityIcon" />;
}

function UrineIcon() {
  return <ReactSVG src="/icons/urine.svg" className="ActivityIcon" />;
}

function VaccineIcon() {
  return <ReactSVG src="/icons/vaccine.svg" className="ActivityIcon" />;
}

function VomitIcon() {
  return <ReactSVG src="/icons/vomit.svg" className="ActivityIcon" />;
}

function WalkIcon() {
  return <ReactSVG src="/icons/walk.svg" className="ActivityIcon" />;
}

function WeightIcon() {
  return <ReactSVG src="/icons/weight.svg" className="ActivityIcon" />;
}

type Props = {
  activity: ActivityModel;
  sx?: SxProps | undefined;
};

export default function ActivityIcon({ activity, sx }: Props) {
  return (
    <Box sx={sx}>
      {(() => {
        switch (activity.type) {
          case ActivityType.Bath:
            return <BathIcon />;
          case ActivityType.BottleFeeding:
            return <BottleFeedingIcon />;
          case ActivityType.BreastFeeding:
            return <BreastFeedingIcon />;
          case ActivityType.Burp:
            return <BurpIcon />;
          case ActivityType.CarRide:
            return <CarRideIcon />;
          case ActivityType.Cry:
            return <CryIcon />;
          case ActivityType.Diaper:
            return <DiaperIcon />;
          case ActivityType.Hiccups:
            return <HiccupsIcon />;
          case ActivityType.HospitalVisit:
            return <HospitalVisitIcon />;
          case ActivityType.Medicine:
            return <MedicineIcon />;
          case ActivityType.MilkExtraction:
            return <MilkExtractionIcon />;
          case ActivityType.NailCutting:
            return <NailCuttingIcon />;
          case ActivityType.NasalHygiene:
            return <NasalHygieneIcon />;
          case ActivityType.Play:
            return <PlayIcon />;
          case ActivityType.Poop:
            return <PoopIcon />;
          case ActivityType.Regurgitation:
            return <RegurgitationIcon />;
          case ActivityType.Size:
            return <SizeIcon />;
          case ActivityType.Sleep:
            return <SleepIcon />;
          case ActivityType.SolidFood:
            return <SolidFoodIcon />;
          case ActivityType.Temperature:
            return <TemperatureIcon />;
          case ActivityType.Teeth:
            return <TeethIcon />;
          case ActivityType.Urine:
            return <UrineIcon />;
          case ActivityType.Vaccine:
            return <VaccineIcon />;
          case ActivityType.Vomit:
            return <VomitIcon />;
          case ActivityType.Walk:
            return <WalkIcon />;
          case ActivityType.Weight:
            return <WeightIcon />;
          default:
            return null;
        }
      })()}
    </Box>
  );
}
