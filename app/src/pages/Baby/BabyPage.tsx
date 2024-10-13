import { Typography, useTheme } from "@mui/material";

import { BabiesLanding } from "@/pages/Baby/components/BabiesLanding";
import BabyForm from "@/pages/Baby/components/BabyForm";
import { PageId } from "@/enums/PageId";
import { PageLayout } from "@/components/PageLayout";
import getPageTitle from "@/utils/getPageTitle";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";
import { useParams } from "react-router-dom";
import { useState } from "react";

export function BabyPage() {
  const { babyId } = useParams();
  const { user } = useAuthentication();
  const theme = useTheme();
  const baby = user?.baby;
  const [showForm, setShowForm] = useState(false);

  if (babyId && baby != null) {
    baby.id = babyId;
  }

  if (babyId != null) {
    // if (isLoading) {
    //   return <LoadingIndicator />;
    // }
    if (baby == null) {
      return (
        <PageLayout
          topBarProps={{
            pageTitle: getPageTitle({ pageId: PageId.Baby }),
            renderBackButton: true,
          }}
          bottomBarProps={{ hide: true }}
        >
          <Typography
            variant={"body1"}
            sx={{
              color: theme.customPalette.text.secondary,
            }}
            textAlign={"center"}
          >
            Une erreur est survenue. Veuillez réessayer plus tard.
          </Typography>
        </PageLayout>
      );
    }
    return (
      <PageLayout
        topBarProps={{
          pageTitle: getPageTitle({ pageId: PageId.Baby }),
          renderBackButton: true,
        }}
        bottomBarProps={{ hide: true }}
      >
        <BabyForm baby={baby} />
      </PageLayout>
    );
  }

  if (showForm) {
    return (
      <PageLayout
        topBarProps={{
          pageTitle: getPageTitle({ pageId: PageId.Baby }),
          renderBackButton: true,
        }}
        bottomBarProps={{ hide: true }}
      >
        <BabyForm />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      topBarProps={{
        pageTitle: getPageTitle({ pageId: PageId.Baby }),
        renderBackButton: true,
      }}
      bottomBarProps={{ hide: true }}
    >
      <BabiesLanding setShowForm={setShowForm} />
    </PageLayout>
  );
}
