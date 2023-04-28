import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Button, Stack, SxProps, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { formatDateTime } from "../../../lib/utils";

type Props = {
  startDateTime?: Date | null;
  stopDateTime?: Date | null;
  durationInSeconds?: number;
  label?: string;
  sx?: SxProps | undefined;
  onDurationChange?: (
    startDateTime: Date,
    stopDateTime: Date,
    durationInSeconds: number
  ) => void;
};

export default function StopWatch(props: Props) {
  /* -------------------------------------------------------------------------- */
  /*                                    Setup                                   */
  /* -------------------------------------------------------------------------- */

  const { onDurationChange } = props;

  const [startDateTime, setStartDateTime] = useState<Date>(
    props.startDateTime || new Date()
  );
  const [stopDateTime, setStopDateTime] = useState<Date>(
    props.stopDateTime || new Date()
  );
  const [durationInSeconds, setDurationInSeconds] = useState<number | null>(
    props.durationInSeconds || null
  );
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const durationLabel = useMemo(() => {
    if (durationInSeconds === null) {
      return "00:00";
    }
    const minutes = Math.floor(durationInSeconds / 60);
    let minutesLabel = minutes.toString();
    if (minutes < 10) {
      minutesLabel = `0${minutesLabel}`;
    }
    const seconds = durationInSeconds % 60;
    let secondsLabel = seconds.toString();
    if (seconds < 10) {
      secondsLabel = `0${secondsLabel}`;
    }
    return `${minutesLabel}:${secondsLabel}`;
  }, [durationInSeconds]);

  const startDateTimeLabel = useMemo(() => {
    if (!startDateTime) return "";
    return formatDateTime(startDateTime);
  }, [startDateTime]);

  const stopDateTimeLabel = useMemo(() => {
    if (!stopDateTime) return "";
    return formatDateTime(stopDateTime);
  }, [stopDateTime]);

  const handleClick = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalId) {
        clearInterval(intervalId);
      }
    } else {
      setIsRunning(true);
      setIntervalId(
        setInterval(() => {
          setDurationInSeconds((prevDuration) => {
            let newDuration = 1;
            if (prevDuration !== null) {
              newDuration = prevDuration + 1;
            }
            const startDateTimeTicks = startDateTime.valueOf();
            const newStopDateTime = new Date(
              startDateTimeTicks + newDuration * 1000
            );
            setStopDateTime(newStopDateTime);
            return newDuration;
          });
        }, 1000)
      );

      if (!hasStarted) {
        setHasStarted(true);
      }
    }
  }, [isRunning, hasStarted, intervalId, durationInSeconds, startDateTime]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Stack
      spacing={2}
      sx={props.sx}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {/* <Stack
        sx={{
          width: "100%",
        }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Container maxWidth={CSSBreakpoint.ExtraSmall}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            sx={{
              width: "100%",
            }}
          >
            <Typography
              textAlign="left"
              variant="body1"
              sx={{
                opacity: hasStarted ? 0.75 : 0.35,
              }}
            >
              Début
            </Typography>
            <Typography
              textAlign="right"
              variant="body1"
              sx={{
                opacity: hasStarted ? 1 : 0.5,
                fontWeight: "bold",
              }}
            >
              {startDateTimeLabel}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            sx={{
              width: "100%",
            }}
          >
            <Typography
              textAlign="left"
              variant="body1"
              sx={{
                opacity: isRunning ? 0.35 : hasStarted ? 0.75 : 0.35,
              }}
            >
              Fin
            </Typography>
            <Typography
              textAlign="right"
              variant="body1"
              sx={{
                opacity: isRunning ? 0.5 : hasStarted ? 1 : 0.5,
                fontWeight: "bold",
              }}
            >
              {stopDateTimeLabel}
            </Typography>
          </Stack>
        </Container>
      </Stack> */}

      <Button
        onClick={handleClick}
        sx={{
          borderRadius: "9999px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 1,
          paddingBottom: 1,
        }}
        variant={isRunning ? "contained" : "outlined"}
      >
        <Typography textAlign="center" variant="h6">
          {durationLabel}
        </Typography>
        {isRunning ? (
          <PauseIcon
            sx={{
              fontSize: "2em",
            }}
          />
        ) : (
          <PlayArrowIcon
            sx={{
              fontSize: "2em",
            }}
          />
        )}
      </Button>
      {props.label && (
        <Typography textAlign="center" variant="h6">
          {props.label}
        </Typography>
      )}
    </Stack>
  );
}
