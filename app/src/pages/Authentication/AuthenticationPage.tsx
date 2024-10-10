import { Box, Stack, Typography, useTheme } from "@mui/material";

import AuthenticationForm from "@/pages/Authentication/components/AuthenticationForm";
import { PageLayout } from "@/components/PageLayout";
import { ReactSVG } from "react-svg";

export function AuthenticationPage() {
  const theme = useTheme();

  return (
    <PageLayout topBarProps={{ hide: true }} bottomBarProps={{ hide: true }}>
      <Stack
        spacing={4}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          height: "100%",
          width: "100%",
          marginTop: 4,
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              fontSize: "12em",
            }}
          >
            <ReactSVG src="/favicon.svg" className="ActivityIcon" />
          </Box>
          <Typography
            variant={"h4"}
            textAlign={"center"}
            fontWeight={600}
            sx={{
              color: theme.customPalette.text.primary,
            }}
          >
            Journal de bébé
          </Typography>
          <Typography
            variant={"body1"}
            textAlign={"center"}
            sx={{
              color: theme.customPalette.text.secondary,
            }}
          >
            Connectez-vous pour commencer
          </Typography>
        </Stack>

        <AuthenticationForm />
      </Stack>
    </PageLayout>
  );
}
