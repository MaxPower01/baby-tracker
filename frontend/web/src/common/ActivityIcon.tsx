import { Button, SxProps, Typography } from "@mui/material";
import { ReactSVG } from "react-svg";
import { ActivityType } from "../lib/enums";
import { Activity } from "../lib/models";
import classes from "./ActivityIcon.module.scss";

function BathIcon() {
  return <ReactSVG src="/bath.svg" />;
}

function BottleFeedingIcon() {
  return <ReactSVG src="/feeding-bottle.svg" />;
}

function BreastFeedingIcon() {
  return <ReactSVG src="/breast-feeding.svg" />;
}

function CryIcon() {
  return <ReactSVG src="/baby-cry.svg" />;
}

function DiaperIcon() {
  return <ReactSVG src="/diaper.svg" />;
}

function HeadCircumferenceIcon() {
  return <ReactSVG src="/measuring-tape.svg" />;
}

function HospitalVisitIcon() {
  return <ReactSVG src="/hospital.svg" />;
}

function MedicineIcon() {
  return <ReactSVG src="/drugs.svg" />;
}

function MilkExtractionIcon() {
  return <ReactSVG src="/breastfeeding-1.svg" />;
}

function PlayIcon() {
  return <ReactSVG src="/rattle.svg" />;
}

function PoopIcon() {
  return <ReactSVG src="/poop.svg" />;
}

function SizeIcon() {
  return <ReactSVG src="/ruler.svg" />;
}

function SleepIcon() {
  return <ReactSVG src="/sleep.svg" />;
}

function SolidFoodIcon() {
  return <ReactSVG src="/baby-food.svg" />;
}

function TemperatureIcon() {
  return <ReactSVG src="/thermometer.svg" />;
}

function TeethIcon() {
  return <ReactSVG src="/clean.svg" />;
}

function UrineIcon() {
  return <ReactSVG src="/water-drops--yellow.svg" />;
}

function VaccineIcon() {
  return <ReactSVG src="/vaccine.svg" />;
}

function WalkIcon() {
  return <ReactSVG src="/stroller.svg" />;
}

function WeightIcon() {
  return <ReactSVG src="/scale.svg" />;
}

type Props = {
  activity: Activity;
  sx?: SxProps | undefined;
  showLabel?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export default function ActivityIcon({
  activity,
  sx,
  showLabel,
  onClick,
}: Props) {
  if (typeof activity.activityType !== "number") return null;
  if (!Object.values(ActivityType).includes(activity.activityType)) return null;
  return (
    <Button
      className={classes.ActivityIcon}
      variant="text"
      color="inherit"
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        ...sx,
      }}
    >
      {(() => {
        switch (activity.activityType) {
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
      {showLabel && (
        <Typography variant="button" textAlign="center">
          {activity.name}
        </Typography>
      )}
    </Button>
  );
}
