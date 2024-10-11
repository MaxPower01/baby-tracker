import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";

import AuthenticationForm from "@/pages/Authentication/components/AuthenticationForm";
import { CustomTopBar } from "@/components/CustomTopBar";
import { PageId } from "@/enums/PageId";
import { PageLayout } from "@/components/PageLayout";
import { ReactSVG } from "react-svg";
import getPath from "@/utils/getPath";
import { useAuthentication } from "@/pages/Authentication/components/AuthenticationProvider";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const { user } = useAuthentication();
  const babyId = useMemo(() => {
    return user?.babyId ?? "";
  }, [user]);
  const theme = useTheme();

  const navigate = useNavigate();

  if (user == null) {
    return (
      <PageLayout OverrideTopBar={CustomTopBar} bottomBarProps={{ hide: true }}>
        <Stack
          spacing={6}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <Stack
            spacing={1}
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              variant={"h4"}
              fontWeight={600}
              sx={{
                color: theme.customPalette.text.primary,
              }}
            >
              Journal de bébé
            </Typography>
            <Typography
              variant={"body1"}
              sx={{
                color: theme.customPalette.text.primary,
              }}
            >
              Votre compagnon pour suivre l'évolution, les repas et la santé de
              bébé
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
            spacing={2}
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
            <AuthenticationForm />
          </Stack>
        </Stack>
      </PageLayout>
    );
  }

  return (
    <PageLayout OverrideTopBar={CustomTopBar} bottomBarProps={{ hide: true }}>
      <Stack
        spacing={4}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Typography
          variant={"body1"}
          textAlign={"center"}
          sx={{
            color: theme.customPalette.text.primary,
          }}
        >
          Choisissez l'une des 2 options suivantes
        </Typography>

        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <Card>
            <CardActionArea
              onClick={() => {
                navigate(
                  getPath({
                    page: PageId.NewBaby,
                  })
                );
              }}
            >
              <CardContent>
                <Stack spacing={2} direction={"row"} alignItems={"center"}>
                  <Box
                    sx={{
                      fontSize: "3em",
                    }}
                  >
                    <ReactSVG
                      src="/icons/baby-face.svg"
                      className="ActivityIcon"
                    />
                  </Box>
                  <Typography
                    variant={"body1"}
                    sx={{
                      color: theme.customPalette.text.primary,
                    }}
                  >
                    Ajouter un bébé
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card>
            <CardActionArea
              onClick={() => {}}
              disabled
              sx={{
                opacity: 0.5,
              }}
            >
              <CardContent>
                <Stack spacing={2} direction={"row"} alignItems={"center"}>
                  <Box
                    sx={{
                      fontSize: "3em",
                    }}
                  >
                    <ReactSVG
                      src="/icons/invitation.svg"
                      className="ActivityIcon"
                    />
                  </Box>
                  <Stack>
                    <Typography
                      variant={"body1"}
                      sx={{
                        color: theme.customPalette.text.primary,
                      }}
                    >
                      Saisir un code d'invitation
                    </Typography>
                    <Typography
                      variant={"body2"}
                      sx={{
                        color: theme.customPalette.text.secondary,
                      }}
                    >
                      Bientôt disponible
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
