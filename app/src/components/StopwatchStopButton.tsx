import { Button } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";

type Props = {
  size: "big" | "small";
  handleClick: () => void;
};

export function StopwatchStopButton(props: Props) {
  const basePadding = props.size === "big" ? 8 : 4;
  const paddingTop = props.size === "big" ? basePadding : 0;
  const paddingBottom = props.size === "big" ? basePadding : 0;
  const paddingLeft = basePadding;
  const paddingRight = basePadding;
  const iconFontSize = props.size === "big" ? "5em" : "2em";
  const initialWidth = props.size === "big" ? "10em" : "2em";
  const aspectRatio = props.size === "big" ? "1/1" : undefined;
  const borderRadius = props.size === "big" ? "50%" : undefined;

  return (
    <Button
      color="primary"
      variant={"outlined"}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: `calc(${initialWidth} + ${basePadding * 2}px)`,
        height: "auto",
        aspectRatio: aspectRatio,
        borderRadius: borderRadius,
        padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        minWidth: "0",
      }}
      onClick={props.handleClick}
    >
      <StopIcon sx={{ fontSize: iconFontSize }} />
    </Button>
  );
}
