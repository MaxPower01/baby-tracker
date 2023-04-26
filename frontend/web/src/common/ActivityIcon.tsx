import { Box, SxProps, Typography } from "@mui/material";
import { ReactSVG } from "react-svg";
import { ActivityIconType } from "../lib/enums";
import { getIconLabel } from "../lib/utils";
import classes from "./ActivityIcon.module.scss";

function BathIcon() {
  return <ReactSVG src="/bath.svg" />;
}

function BreastFeedingLeftIcon() {
  return <ReactSVG src="/breast-feeding.svg" />;
}

function BreastFeedingRightIcon() {
  return (
    <ReactSVG src="/breast-feeding.svg" style={{ transform: "scaleX(-1)" }} />
  );
}

function DiaperIcon() {
  return <ReactSVG src="/diaper.svg" />;
}

function FeedingBottleIcon() {
  return <ReactSVG src="/feeding-bottle.svg" />;
}

function MeasuringTapeIcon() {
  return <ReactSVG src="/measuring-tape.svg" />;
}

function PoopIcon() {
  return <ReactSVG src="/poop.svg" />;
}

function RulerIcon() {
  return <ReactSVG src="/ruler.svg" />;
}

function ScaleIcon() {
  return <ReactSVG src="/scale.svg" />;
}

function SleepIcon() {
  return <ReactSVG src="/sleep.svg" />;
}

function WaterDropsIcon() {
  return <ReactSVG src="/water-drops.svg" />;
}

type Props = {
  type: ActivityIconType;
  sx?: SxProps | undefined;
  showLabel?: boolean;
};

export default function ActivityIcon({ type, sx, showLabel }: Props) {
  if (typeof type !== "number") return null;
  if (!Object.values(ActivityIconType).includes(type)) return null;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
      className={classes.ActivityIcon}
    >
      {(() => {
        switch (type) {
          case ActivityIconType.Bath:
            return <BathIcon />;
          case ActivityIconType.BreastFeedingLeft:
            return <BreastFeedingLeftIcon />;
          case ActivityIconType.BreastFeedingRight:
            return <BreastFeedingRightIcon />;
          case ActivityIconType.Diaper:
            return <DiaperIcon />;
          case ActivityIconType.FeedingBottle:
            return <FeedingBottleIcon />;
          case ActivityIconType.MeasuringTape:
            return <MeasuringTapeIcon />;
          case ActivityIconType.Poop:
            return <PoopIcon />;
          case ActivityIconType.Ruler:
            return <RulerIcon />;
          case ActivityIconType.Scale:
            return <ScaleIcon />;
          case ActivityIconType.Sleep:
            return <SleepIcon />;
          case ActivityIconType.WaterDrops:
            return <WaterDropsIcon />;
          default:
            return null;
        }
      })()}
      {showLabel && (
        <Typography variant="body1" textAlign="center">
          {getIconLabel(type)}
        </Typography>
      )}
    </Box>
  );
}
