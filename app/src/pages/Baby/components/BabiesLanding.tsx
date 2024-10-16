import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import ChildCareIcon from "@mui/icons-material/ChildCare";
import React from "react";
import { ReactSVG } from "react-svg";

type Props = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export function BabiesLanding({ setShowForm }: Props) {
  const theme = useTheme();
  return (
    <Stack spacing={4}>
      <Stack
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            fontSize: "10em",
          }}
        >
          <ReactSVG src="/stickers/baby.svg" className="Sticker" />
        </Box>
        <Stack spacing={1}>
          <Typography
            variant={"h4"}
            textAlign={"center"}
            fontWeight={"bold"}
            sx={{
              color: theme.customPalette.text.primary,
            }}
          >
            Ajoutez votre enfant
          </Typography>
          <Typography
            variant={"body1"}
            textAlign={"center"}
            sx={{
              color: theme.customPalette.text.secondary,
            }}
          >
            La première étape pour utiliser l'application est d'ajouter un
            enfant à votre compte.
          </Typography>
        </Stack>
      </Stack>
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          width: "100%",
        }}
      >
        <Button
          variant={"contained"}
          color={"primary"}
          size="large"
          onClick={() => {
            setShowForm(true);
          }}
        >
          <Stack direction={"row"} spacing={1}>
            <ChildCareIcon />
            <Typography variant="button">Ajouter mon enfant</Typography>
          </Stack>
        </Button>
      </Stack>
      <Stack>
        <Typography
          variant={"body2"}
          textAlign={"center"}
          sx={{
            color: theme.customPalette.text.secondary,
            // fontStyle: "italic",
            // opacity: 0.8,
          }}
        >
          Votre paretenaire utilise déjà l'application ?
        </Typography>
        <Typography
          variant={"body2"}
          textAlign={"center"}
          sx={{
            color: theme.customPalette.text.tertiary,
            // fontStyle: "italic",
            // opacity: 0.5,
          }}
        >
          Demandez-lui de vous ajouter en tant que parent, puis rafraichissez la
          page.
        </Typography>
      </Stack>
    </Stack>
  );
}
