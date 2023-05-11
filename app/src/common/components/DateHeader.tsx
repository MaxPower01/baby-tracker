import { upperCaseFirst } from "@/lib/utils";
import {
  Box,
  Button,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";

type Props = {
  sx?: SxProps;
  startDate: Date;
};

export default function DateHeader(props: Props) {
  const { startDate, sx } = props;
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <Button
        sx={{
          padding: 1,
          borderRadius: 0,
          textTransform: "none",
          color: theme.palette.text.primary,
        }}
        fullWidth
        variant="text"
      >
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              background: theme.customPalette.background.avatar,
              minWidth: "3.5em",
              minHeight: "3.5em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 1,
            }}
          >
            <Typography textAlign={"center"} fontWeight={"bold"} variant="h5">
              {startDate.toLocaleDateString("fr-CA", {
                day: "numeric",
              })}
            </Typography>
          </Box>
          <Stack
            spacing={1}
            sx={{
              paddingTop: 1,
              paddingBottom: 1,
            }}
          >
            <Typography
              variant="body1"
              textAlign={"left"}
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
              variant="body2"
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
      </Button>
    </Box>
  );
}
