import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";

import { BabiesLanding } from "@/pages/Baby/components/BabiesLanding";
import BabyForm from "@/pages/Baby/components/BabyForm";
import { BabyWizard } from "@/pages/Baby/components/BabyWizard";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ReactSVG } from "react-svg";
import { useBabies } from "@/pages/Baby/components/BabiesProvider";
import { useParams } from "react-router-dom";

export function BabyPage() {
  const { babyId } = useParams();
  const { babies, isLoading } = useBabies();
  const theme = useTheme();
  const baby = useMemo(
    () => babies?.find((b) => b.id === babyId),
    [babies, babyId]
  );
  const [showForm, setShowForm] = useState(false);

  if (babyId != null) {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (baby == null) {
      return (
        <Typography
          variant={"body1"}
          color={theme.customPalette.text.secondary}
          textAlign={"center"}
        >
          Une erreur est survenue. Veuillez réessayer plus tard.
        </Typography>
      );
    }
    return <BabyForm baby={baby} />;
  }

  if (showForm) {
    return <BabyForm />;
  }

  return <BabiesLanding setShowForm={setShowForm} />;
}
