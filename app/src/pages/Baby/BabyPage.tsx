import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { BabiesLanding } from "@/pages/Baby/components/BabiesLanding";
import BabyForm from "@/pages/Baby/components/BabyForm";
import { BabyWizard } from "@/pages/Baby/components/BabyWizard";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ReactSVG } from "react-svg";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useLayout } from "@/components/LayoutProvider";
import { useParams } from "react-router-dom";

export function BabyPage() {
  const layout = useLayout();
  useEffect(() => {
    layout.setBottomBarVisibility("hidden");
    return () => {
      layout.setBottomBarVisibility("visible");
    };
  }, []);

  const { babyId } = useParams();
  const { user } = useAuthentication();
  const theme = useTheme();
  const baby = useMemo(
    () => user?.babies?.find((b) => b.id === babyId),
    [user?.babies, babyId]
  );
  const [showForm, setShowForm] = useState(false);

  if (babyId != null) {
    // if (isLoading) {
    //   return <LoadingIndicator />;
    // }
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
