import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";

import ChildForm from "@/modules/children/components/ChildForm";
import ChildLanding from "@/modules/children/components/ChildLanding";
import ChildWizard from "@/modules/children/components/ChildWizard";
import LoadingIndicator from "@/common/components/LoadingIndicator";
import { ReactSVG } from "react-svg";
import useChildren from "@/modules/children/hooks/useChildren";
import { useParams } from "react-router-dom";

export default function ChildPage() {
  const { childId } = useParams();
  const { children, isLoading } = useChildren();
  const theme = useTheme();
  const child = useMemo(
    () => children?.find((child) => child.id === childId),
    [children, childId]
  );
  const [showForm, setShowForm] = useState(false);

  if (childId != null) {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (child == null) {
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
    return <ChildForm child={child} />;
  }

  if (showForm) {
    return <ChildForm />;
  }

  return <ChildLanding setShowForm={setShowForm} />;
}
