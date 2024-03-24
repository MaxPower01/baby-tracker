import {
  Box,
  Button,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";

import { upperCaseFirst } from "@/utils/utils";
import { useSelector } from "react-redux";

type Props = {
  sx?: SxProps;
  date: Date;
};

export function DateHeader(props: Props) {
  const { date: date, sx } = props;
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
          spacing={1}
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              // background: theme.customPalette.background.avatar,
              background: theme.palette.divider,
              minWidth: "2.5em",
              minHeight: "2.5em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 0.75,
            }}
          >
            <Typography textAlign={"center"} fontWeight={600} variant={"h6"}>
              {date.toLocaleDateString("fr-CA", {
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
              variant={"body1"}
              textAlign={"left"}
              fontWeight={600}
              sx={{
                lineHeight: 1,
              }}
            >
              {upperCaseFirst(
                date.toLocaleDateString("fr-CA", {
                  weekday: "long",
                })
              )}
            </Typography>
            <Typography
              variant={"body2"}
              textAlign={"left"}
              sx={{
                opacity: 0.5,
                lineHeight: 1,
              }}
            >
              {upperCaseFirst(
                date.toLocaleDateString("fr-CA", {
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
