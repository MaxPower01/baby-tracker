import {
  Box,
  Button,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";

import { selectUseCompactMode } from "@/modules/settings/state/settingsSlice";
import { upperCaseFirst } from "@/utils/utils";
import { useSelector } from "react-redux";

type Props = {
  sx?: SxProps;
  startDate: Date;
};

export default function DateHeader(props: Props) {
  const { startDate, sx } = props;
  const useCompactMode = useSelector(selectUseCompactMode);
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <Box
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 0,
          paddingRight: 0,
          borderRadius: 0,
          textTransform: "none",
          color: theme.customPalette.text.primary,
        }}
        // fullWidth
        // variant="text"
      >
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={useCompactMode ? 1 : 2}
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              // background: theme.customPalette.background.avatar,
              background: theme.palette.divider,
              minWidth: useCompactMode ? "2.5em" : "3.25em",
              minHeight: useCompactMode ? "2.5em" : "3.25em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: useCompactMode ? 0.75 : 1,
            }}
          >
            <Typography
              textAlign={"center"}
              fontWeight={600}
              variant={useCompactMode ? "h6" : "h5"}
            >
              {startDate.toLocaleDateString("fr-CA", {
                day: "numeric",
              })}
            </Typography>
          </Box>
          <Stack
            spacing={0.5}
            sx={{
              paddingTop: 0.25,
              paddingBottom: 0.25,
            }}
          >
            <Typography
              variant={useCompactMode ? "body1" : "h6"}
              textAlign={"left"}
              fontWeight={600}
              sx={{
                lineHeight: 1,
              }}
            >
              {upperCaseFirst(
                startDate.toLocaleDateString("fr-CA", {
                  weekday: "long",
                })
              )}
            </Typography>
            <Typography
              variant={useCompactMode ? "body2" : "body1"}
              textAlign={"left"}
              sx={{
                opacity: 0.5,
                lineHeight: 1,
              }}
            >
              {upperCaseFirst(
                startDate.toLocaleDateString("fr-CA", {
                  month: "long",
                  year: "numeric",
                })
              )}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
