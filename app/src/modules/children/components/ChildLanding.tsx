import { Box, Button, Stack, Typography } from "@mui/material";

import React from "react";
import { ReactSVG } from "react-svg";

type Props = {
  setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ChildLanding({ setShowWizard }: Props) {
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
          <Typography variant={"h4"} textAlign={"center"} fontWeight={"bold"}>
            Ajoutez votre enfant
          </Typography>
          <Typography variant={"body1"} textAlign={"center"}>
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
            setShowWizard(true);
          }}
        >
          Ajouter mon enfant
        </Button>
      </Stack>
      <Stack>
        <Typography
          variant={"body1"}
          textAlign={"center"}
          // color={"text.secondary"}
          sx={
            {
              // fontStyle: "italic",
              // opacity: 0.8,
            }
          }
        >
          Votre paretenaire utilise déjà l'application ?
        </Typography>
        <Typography
          variant={"body1"}
          textAlign={"center"}
          color={"text.secondary"}
          sx={
            {
              // fontStyle: "italic",
              // opacity: 0.5,
            }
          }
        >
          Demandez-lui de vous ajouter en tant que parent, puis rafraichissez la
          page.
        </Typography>
      </Stack>
    </Stack>
  );
}
