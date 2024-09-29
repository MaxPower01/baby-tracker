import { Box, Stack, Typography, useTheme } from "@mui/material";

import { ReactSVG } from "react-svg";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useMemo } from "react";

export default function LandingPage() {
  const { user } = useAuthentication();
  const babyId = useMemo(() => {
    return user?.babyId ?? "";
  }, [user]);
  const theme = useTheme();

  return (
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
      <Stack
        spacing={1}
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          variant={"h5"}
          fontWeight={600}
          sx={{
            color: theme.customPalette.text.primary,
          }}
        >
          Bienvenue sur Journal de bébé
        </Typography>
        <Typography
          variant={"body1"}
          sx={{
            color: theme.customPalette.text.primary,
          }}
        >
          L'outil complet pour suivre les activités, la santé, les boires, les
          couches et bien plus encore de votre bébé
        </Typography>
      </Stack>

      <Box
        sx={{
          fontSize: "10em",
        }}
      >
        <ReactSVG src="/favicon.svg" className="ActivityIcon" />
      </Box>

      <Stack
        spacing={1}
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          variant={"body1"}
          sx={{
            color: theme.customPalette.text.secondary,
          }}
        >
          Pour commencer, connectez-vous ou créez un compte
        </Typography>
      </Stack>
    </Stack>
  );
}
