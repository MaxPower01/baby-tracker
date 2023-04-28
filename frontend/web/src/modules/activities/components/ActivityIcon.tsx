import { Box, SxProps } from "@mui/material";
import { ReactSVG } from "react-svg";
import { ActivityType } from "../../../lib/enums";
import { Activity } from "../models/Activity";
import classes from "./ActivityIcon.module.scss";

function BathIcon() {
  return <ReactSVG src="/bath.svg" className={classes.ActivityIcon} />;
}

function BottleFeedingIcon() {
  return (
    <ReactSVG src="/feeding-bottle.svg" className={classes.ActivityIcon} />
  );
}

function BreastFeedingIcon() {
  return (
    <ReactSVG src="/breast-feeding.svg" className={classes.ActivityIcon} />
  );
}

function CryIcon() {
  return <ReactSVG src="/baby-cry.svg" className={classes.ActivityIcon} />;
}

function DiaperIcon() {
  return <ReactSVG src="/diaper.svg" className={classes.ActivityIcon} />;
}

function HeadCircumferenceIcon() {
  return (
    <ReactSVG src="/measuring-tape.svg" className={classes.ActivityIcon} />
  );
}

function HospitalVisitIcon() {
  return <ReactSVG src="/hospital.svg" className={classes.ActivityIcon} />;
}

function MedicineIcon() {
  return <ReactSVG src="/drugs.svg" className={classes.ActivityIcon} />;
}

function MilkExtractionIcon() {
  return (
    <ReactSVG src="/breastfeeding-1.svg" className={classes.ActivityIcon} />
  );
}

function PlayIcon() {
  return <ReactSVG src="/rattle.svg" className={classes.ActivityIcon} />;
}

function PoopIcon() {
  return <ReactSVG src="/poop.svg" className={classes.ActivityIcon} />;
}

function SizeIcon() {
  return <ReactSVG src="/ruler.svg" className={classes.ActivityIcon} />;
}

function SleepIcon() {
  return <ReactSVG src="/sleep.svg" className={classes.ActivityIcon} />;
}

function SolidFoodIcon() {
  return <ReactSVG src="/baby-food.svg" className={classes.ActivityIcon} />;
}

function TemperatureIcon() {
  return <ReactSVG src="/thermometer.svg" className={classes.ActivityIcon} />;
}

function TeethIcon() {
  return <ReactSVG src="/clean.svg" className={classes.ActivityIcon} />;
}

function UrineIcon() {
  return (
    <ReactSVG src="/water-drops--yellow.svg" className={classes.ActivityIcon} />
  );
}

function VaccineIcon() {
  return <ReactSVG src="/vaccine.svg" className={classes.ActivityIcon} />;
}

function WalkIcon() {
  return <ReactSVG src="/stroller.svg" className={classes.ActivityIcon} />;
}

function WeightIcon() {
  return <ReactSVG src="/scale.svg" className={classes.ActivityIcon} />;
}

type Props = {
  activity: Activity;
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
          case ActivityType.Cry:
            return <CryIcon />;
          case ActivityType.Diaper:
            return <DiaperIcon />;
          case ActivityType.HeadCircumference:
            return <HeadCircumferenceIcon />;
          case ActivityType.HospitalVisit:
            return <HospitalVisitIcon />;
          case ActivityType.Medicine:
            return <MedicineIcon />;
          case ActivityType.MilkExtraction:
            return <MilkExtractionIcon />;
          case ActivityType.Play:
            return <PlayIcon />;
          case ActivityType.Poop:
            return <PoopIcon />;
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
