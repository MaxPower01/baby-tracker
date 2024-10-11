import { PageLayout } from "@/components/PageLayout";
import React from "react";
import { Typography } from "@mui/material";

export default function NotFoundPage() {
  return (
    <PageLayout
      topBarProps={{
        hide: true,
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h2">Page non trouvée</Typography>
    </PageLayout>
  );
}
