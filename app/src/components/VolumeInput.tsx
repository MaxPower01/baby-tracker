import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  SwipeableDrawer,
  SxProps,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useState } from "react";

type Props = {
  buttonId: string;
  label?: string;
  sx?: SxProps | undefined;
  volume: number;
  inputsAreDisabled?: boolean;
  onChange: (params: { volume: number }) => void;
};

export function VolumeInput(props: Props) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const theme = useTheme();

  const textfieldStyle: SxProps = {
    "& *:before": {
      border: "none !important",
    },
    "& *:after": {
      border: "none !important",
    },
    // transform: "translateX(-0.5em)",
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    let newVolume = parseInt(value);
    if (newVolume < 0) {
      newVolume = 0;
    }
    if (newVolume > 1000) {
      newVolume = 1000;
    }
    if (isNaN(newVolume)) {
      newVolume = 0;
    }
    props.onChange({
      volume: newVolume,
    });
  };

  return (
    <>
      <Stack
        spacing={2}
        sx={props.sx}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {/* {props.label && (
          <Typography textAlign="center" variant="body1">
            {props.label}
          </Typography>
        )} */}
        <Button
          id={props.buttonId}
          variant="outlined"
          onClick={() => {
            setDrawerIsOpen(true);
          }}
          disabled={props.inputsAreDisabled}
        >
          <Stack spacing={0} justifyContent={"center"} alignItems={"center"}>
            {props.label && (
              <Typography
                textAlign="center"
                variant="body1"
                textTransform={"none"}
                fontWeight={"300"}
              >
                {props.label}
              </Typography>
            )}
            <Typography variant="h6" textTransform={"none"}>
              {props.volume} ml
            </Typography>
          </Stack>
        </Button>
      </Stack>

      <SwipeableDrawer
        anchor="bottom"
        open={drawerIsOpen}
        onOpen={() => {}}
        onClose={() => setDrawerIsOpen(false)}
        disableSwipeToOpen={true}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "inherit",
            backgroundImage: "inherit",
          }}
        >
          <Container maxWidth={CSSBreakpoint.Small} disableGutters>
            <Toolbar>
              <Typography variant="h6">
                Modifier le volume
                {!isNullOrWhiteSpace(props.label) && ` (${props.label})`}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => setDrawerIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
            <Divider
              sx={{
                marginLeft: 2,
                marginRight: 2,
              }}
            />
          </Container>
        </Box>
        <Container maxWidth={CSSBreakpoint.Small}>
          <Box
            sx={{
              maxHeight: "70vh",
            }}
          >
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              <TextField
                variant="standard"
                type="number"
                name="volume"
                placeholder="00"
                value={props.volume}
                onChange={handleInputChange}
                sx={{
                  ...textfieldStyle,
                  maxWidth: "8em",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ml</InputAdornment>
                  ),
                  onFocus: (event) => {
                    event.target.select();
                  },
                  sx: {
                    "& input": {
                      textAlign: "center",
                      fontSize: "2em",
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    },
                  },
                }}
                disabled={props.inputsAreDisabled}
              />
            </Stack>
          </Box>
        </Container>
      </SwipeableDrawer>
    </>
  );
}
