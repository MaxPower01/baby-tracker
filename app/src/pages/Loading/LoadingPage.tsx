import { Box } from "@mui/material";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageLayout } from "@/components/PageLayout";
import React from "react";

export function LoadingPage() {
  return (
    <PageLayout topBarProps={{ hide: true }} bottomBarProps={{ hide: true }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingIndicator size={80} />
        </Box>
      </Box>
    </PageLayout>
  );
}
