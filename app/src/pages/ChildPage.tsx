import ChildWizard from "@/modules/children/components/ChildWizard";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ReactSVG } from "react-svg";

export default function ChildPage() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <ChildWizard />;
  } else {
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
              fontSize: "15em",
            }}
          >
            <ReactSVG src="/stickers/baby.svg" className="Sticker" />
          </Box>
          <Typography variant={"h4"} textAlign={"center"} fontWeight={"bold"}>
            Ajoutez un enfant
          </Typography>
          <Stack spacing={1}>
            <Typography variant={"body1"} textAlign={"center"}>
              La première étape pour utiliser l'application est d'ajouter un
              enfant à votre compte.
            </Typography>
          </Stack>
          <Button
            variant={"contained"}
            color={"primary"}
            size="large"
            onClick={() => {
              setShowWizard(true);
            }}
          >
            Ajouter un enfant
          </Button>
        </Stack>
        <Typography
          variant={"body1"}
          textAlign={"center"}
          sx={{
            fontStyle: "italic",
            opacity: 0.5,
          }}
        >
          Si votre partenaire a déjà ajouté un enfant, demandez-lui de vous
          ajouter en tant que parent, puis rafrachissez la page.
        </Typography>
      </Stack>
    );
  }
}
